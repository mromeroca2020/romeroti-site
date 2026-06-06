(function () {
  const API_BASE = window.RomanotiSmartHandsConfig?.apiBase || "http://127.0.0.1:8775";

  const EVIDENCE_TYPES = [
    "SCREENSHOT",
    "PHOTO",
    "CONSOLE_OUTPUT",
    "CABLE_LABEL",
    "OPTIC_SERIAL",
    "VALIDATION_NOTE",
    "CUSTOMER_CONFIRMATION",
    "ENGINEER_CONFIRMATION",
    "OTHER"
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function getSelectedTicketId() {
    const selectedRow = document.querySelector(".ticket-row.selected-row");

    if (selectedRow && selectedRow.dataset.ticketId) {
      return selectedRow.dataset.ticketId;
    }

    const firstRow = document.querySelector(".ticket-row");

    if (firstRow && firstRow.dataset.ticketId) {
      return firstRow.dataset.ticketId;
    }

    return null;
  }

  function getSelectedTicketNumber() {
    const selectedRow = document.querySelector(".ticket-row.selected-row");

    if (!selectedRow) return "selected ticket";

    const number = selectedRow.querySelector(".ticket-number");

    return number ? number.textContent.trim() : "selected ticket";
  }

  function buildModal() {
    if (document.getElementById("addEvidenceModal")) return;

    const modal = document.createElement("div");
    modal.id = "addEvidenceModal";
    modal.className = "modal-backdrop hidden";

    modal.innerHTML = `
      <div class="modal-card work-note-modal-card">
        <div class="modal-header">
          <div>
            <p class="panel-kicker">Smart Hands Desk</p>
            <h3>Add Evidence</h3>
            <p id="addEvidenceTicketLabel">Add an evidence record to the selected ticket.</p>
          </div>
          <button class="modal-close" id="closeAddEvidenceModal" type="button">×</button>
        </div>

        <form id="addEvidenceForm" class="ticket-form">
          <div class="form-grid">
            <label class="form-field full">
              <span>Evidence Name *</span>
              <input name="file_name" required placeholder="Example: Before-after validation screenshot" />
            </label>

            <label class="form-field">
              <span>Evidence Type</span>
              <select name="file_type">
                ${EVIDENCE_TYPES.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item.replaceAll("_", " "))}</option>`).join("")}
              </select>
            </label>

            <label class="form-field">
              <span>Uploaded By</span>
              <input name="uploaded_by" value="Romanoti Operator" />
            </label>

            <label class="form-field full">
              <span>Evidence Reference</span>
              <input name="evidence_reference" placeholder="Example: screenshot name, file path, ticket note, share link, manual reference..." />
            </label>

            <label class="form-field full">
              <span>Description / Evidence Note</span>
              <textarea name="description" rows="5" placeholder="Describe what this evidence proves, before/after result, validation performed, or relevant observation..."></textarea>
            </label>
          </div>

          <div class="detail-section" style="margin-top:16px;">
            <h4>Evidence Record</h4>
            <p class="ticket-sub">
              This first version records evidence metadata and references. Physical file upload can be added later.
              The record will appear under Attachments / Evidence and will also create an evidence history event.
            </p>
          </div>

          <div id="addEvidenceMessage" class="form-message hidden"></div>

          <div class="modal-actions">
            <button type="button" class="ghost-btn" id="cancelAddEvidence">Cancel</button>
            <button type="submit" class="primary-btn" id="submitAddEvidence">Add Evidence</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeAddEvidenceModal").addEventListener("click", closeModal);
    document.getElementById("cancelAddEvidence").addEventListener("click", closeModal);
    document.getElementById("addEvidenceForm").addEventListener("submit", submitEvidence);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    const ticketId = getSelectedTicketId();

    if (!ticketId) {
      alert("Select a ticket before adding evidence.");
      return;
    }

    buildModal();

    const modal = document.getElementById("addEvidenceModal");
    const form = document.getElementById("addEvidenceForm");
    const message = document.getElementById("addEvidenceMessage");
    const label = document.getElementById("addEvidenceTicketLabel");

    form.reset();
    form.querySelector('[name="uploaded_by"]').value = "Romanoti Operator";
    form.querySelector('[name="file_type"]').value = "SCREENSHOT";

    message.className = "form-message hidden";
    message.textContent = "";

    label.innerHTML = `Add evidence to <strong>${escapeHtml(getSelectedTicketNumber())}</strong>.`;

    modal.dataset.ticketId = ticketId;
    modal.classList.remove("hidden");

    setTimeout(function () {
      form.querySelector('[name="file_name"]').focus();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("addEvidenceModal");
    if (modal) modal.classList.add("hidden");
  }

  function formToPayload(form) {
    const formData = new FormData(form);
    const payload = {};

    for (const [key, value] of formData.entries()) {
      payload[key] = String(value || "").trim();
    }

    return payload;
  }

  async function submitEvidence(event) {
    event.preventDefault();

    const modal = document.getElementById("addEvidenceModal");
    const form = event.target;
    const message = document.getElementById("addEvidenceMessage");
    const submitButton = document.getElementById("submitAddEvidence");
    const ticketId = modal.dataset.ticketId;
    const payload = formToPayload(form);

    if (!ticketId) {
      message.className = "form-message error";
      message.textContent = "No ticket selected.";
      return;
    }

    if (!payload.file_name) {
      message.className = "form-message error";
      message.textContent = "Evidence name is required.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Saving...";
      message.className = "form-message";
      message.textContent = "Saving evidence record...";

      const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/attachments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        message.className = "form-message error";
        message.textContent = data.error || "Evidence record could not be added.";
        return;
      }

      const ticketNumber = data.detail.ticket.ticket_number;

      message.className = "form-message success";
      message.innerHTML = `Evidence added to <strong>${escapeHtml(ticketNumber)}</strong>. Refreshing...`;

      setTimeout(function () {
        window.location.reload();
      }, 900);

    } catch (error) {
      message.className = "form-message error";
      message.textContent = "Cannot reach Smart Hands Desk backend on port 8775.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Add Evidence";
    }
  }

  function findRomanotiActionsContainer() {
    const headings = Array.from(document.querySelectorAll(".detail-section h4"));

    for (const heading of headings) {
      if (heading.textContent.trim().toLowerCase() === "romanoti actions") {
        const section = heading.closest(".detail-section");
        return section ? section.querySelector(".integration-actions") : null;
      }
    }

    return null;
  }

  function injectAddEvidenceButton() {
    const actions = findRomanotiActionsContainer();
    if (!actions) return;

    if (actions.querySelector("[data-shd-add-evidence]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "small-btn";
    button.dataset.shdAddEvidence = "true";
    button.textContent = "Add Evidence";
    button.addEventListener("click", openModal);

    actions.prepend(button);
  }

  function observeTicketDetailChanges() {
    const target = document.getElementById("ticketDetail");
    if (!target) return;

    const observer = new MutationObserver(function () {
      injectAddEvidenceButton();
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    buildModal();
    injectAddEvidenceButton();
    observeTicketDetailChanges();

    setTimeout(injectAddEvidenceButton, 500);
    setTimeout(injectAddEvidenceButton, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

