(function () {
  const API_BASE = window.RomanotiSmartHandsConfig?.apiBase || "http://127.0.0.1:8775";

  const CLOSURE_TYPES = [
    "Completed - Work performed successfully",
    "Completed - Verified with requester",
    "Completed - Evidence captured",
    "No action required",
    "Issue not reproduced",
    "Cancelled by requester",
    "Duplicate / related ticket",
    "Unable to complete - missing access",
    "Unable to complete - missing material",
    "Escalated to engineering"
  ];

  const NOTIFICATION_METHODS = [
    "Ticket comment",
    "Email",
    "Phone",
    "Teams / chat",
    "In person",
    "Not required",
    "Other"
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

  function getCurrentVisibleStatus() {
    const detailStatus = document.getElementById("detailStatus");
    return detailStatus ? detailStatus.textContent.trim().toLowerCase() : "";
  }

  function buildModal() {
    if (document.getElementById("closeTicketModal")) return;

    const modal = document.createElement("div");
    modal.id = "closeTicketModal";
    modal.className = "modal-backdrop hidden";

    modal.innerHTML = `
      <div class="modal-card work-note-modal-card">
        <div class="modal-header">
          <div>
            <p class="panel-kicker">Smart Hands Desk</p>
            <h3>Close Ticket</h3>
            <p id="closeTicketLabel">Close the selected ticket with a contextual closure note.</p>
          </div>
          <button class="modal-close" id="closeCloseTicketModal" type="button">×</button>
        </div>

        <form id="closeTicketForm" class="ticket-form">
          <div class="form-grid">
            <label class="form-field full">
              <span>Closure Type *</span>
              <select name="closure_type" required>
                ${CLOSURE_TYPES.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
              </select>
            </label>

            <label class="form-field">
              <span>Person / Requester Informed</span>
              <input name="informed_person" placeholder="Example: requester, engineer, customer contact" />
            </label>

            <label class="form-field">
              <span>Notification Method</span>
              <select name="notification_method">
                ${NOTIFICATION_METHODS.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
              </select>
            </label>

            <label class="form-field">
              <span>Closed By</span>
              <input name="closed_by" value="Romanoti Operator" />
            </label>

            <label class="form-field full">
              <span>Additional Closure Comment</span>
              <textarea name="closure_comment" rows="5" placeholder="Optional: add specific result, evidence, validation, dependency, or communication details..."></textarea>
            </label>
          </div>

          <div class="detail-section" style="margin-top:16px;">
            <h4>Smart Closure Note</h4>
            <p class="ticket-sub">
              The backend will automatically include the ticket context in the closure note:
              ticket number, title, description, task type, site, location, rack, device, port,
              requester/person informed, notification method, previous status, and final status.
            </p>
          </div>

          <div id="closeTicketMessage" class="form-message hidden"></div>

          <div class="modal-actions">
            <button type="button" class="ghost-btn" id="cancelCloseTicket">Cancel</button>
            <button type="submit" class="primary-btn" id="submitCloseTicket">Close Ticket</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeCloseTicketModal").addEventListener("click", closeModal);
    document.getElementById("cancelCloseTicket").addEventListener("click", closeModal);
    document.getElementById("closeTicketForm").addEventListener("submit", submitCloseTicket);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    const ticketId = getSelectedTicketId();

    if (!ticketId) {
      alert("Select a ticket before closing it.");
      return;
    }

    const currentStatus = getCurrentVisibleStatus();

    if (currentStatus === "closed") {
      alert("This ticket is already closed.");
      return;
    }

    buildModal();

    const modal = document.getElementById("closeTicketModal");
    const form = document.getElementById("closeTicketForm");
    const message = document.getElementById("closeTicketMessage");
    const label = document.getElementById("closeTicketLabel");

    form.reset();
    form.querySelector('[name="closed_by"]').value = "Romanoti Operator";
    form.querySelector('[name="notification_method"]').value = "Ticket comment";

    message.className = "form-message hidden";
    message.textContent = "";

    label.innerHTML = `Close <strong>${escapeHtml(getSelectedTicketNumber())}</strong> with a contextual closure note.`;

    modal.dataset.ticketId = ticketId;
    modal.classList.remove("hidden");

    setTimeout(function () {
      form.querySelector('[name="closure_type"]').focus();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("closeTicketModal");
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

  async function submitCloseTicket(event) {
    event.preventDefault();

    const modal = document.getElementById("closeTicketModal");
    const form = event.target;
    const message = document.getElementById("closeTicketMessage");
    const submitButton = document.getElementById("submitCloseTicket");
    const ticketId = modal.dataset.ticketId;
    const payload = formToPayload(form);

    if (!ticketId) {
      message.className = "form-message error";
      message.textContent = "No ticket selected.";
      return;
    }

    if (!payload.closure_type) {
      message.className = "form-message error";
      message.textContent = "Closure type is required.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Closing...";
      message.className = "form-message";
      message.textContent = "Closing ticket and generating contextual closure note...";

      const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        message.className = "form-message error";
        message.textContent = data.error || "Ticket could not be closed.";
        return;
      }

      const ticketNumber = data.detail.ticket.ticket_number;

      message.className = "form-message success";
      message.innerHTML = `<strong>${escapeHtml(ticketNumber)}</strong> closed successfully. Contextual closure note generated. Refreshing...`;

      setTimeout(function () {
        window.location.reload();
      }, 1000);

    } catch (error) {
      message.className = "form-message error";
      message.textContent = "Cannot reach Smart Hands Desk backend on port 8775.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Close Ticket";
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

  function injectCloseTicketButton() {
    const actions = findRomanotiActionsContainer();
    if (!actions) return;

    if (actions.querySelector("[data-shd-close-ticket]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "small-btn";
    button.dataset.shdCloseTicket = "true";
    button.textContent = "Close Ticket";
    button.addEventListener("click", openModal);

    actions.prepend(button);
  }

  function observeTicketDetailChanges() {
    const target = document.getElementById("ticketDetail");
    if (!target) return;

    const observer = new MutationObserver(function () {
      injectCloseTicketButton();
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    buildModal();
    injectCloseTicketButton();
    observeTicketDetailChanges();

    setTimeout(injectCloseTicketButton, 500);
    setTimeout(injectCloseTicketButton, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

