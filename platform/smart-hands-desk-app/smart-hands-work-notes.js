(function () {
  const API_BASE = window.RomanotiSmartHandsConfig?.apiBase || "http://127.0.0.1:8775";

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
    if (document.getElementById("addWorkNoteModal")) return;

    const modal = document.createElement("div");
    modal.id = "addWorkNoteModal";
    modal.className = "modal-backdrop hidden";

    modal.innerHTML = `
      <div class="modal-card work-note-modal-card">
        <div class="modal-header">
          <div>
            <p class="panel-kicker">Smart Hands Desk</p>
            <h3>Add Work Note</h3>
            <p id="addWorkNoteTicketLabel">Add an operational note to the selected ticket.</p>
          </div>
          <button class="modal-close" id="closeAddWorkNoteModal" type="button">×</button>
        </div>

        <form id="addWorkNoteForm" class="ticket-form">
          <div class="form-grid">
            <label class="form-field">
              <span>Created By</span>
              <input name="created_by" value="Romanoti Operator" />
            </label>

            <label class="form-field">
              <span>Note Type</span>
              <select name="note_type">
                <option value="WORK_NOTE">Work Note</option>
                <option value="CUSTOMER_COMMENT">Customer Comment</option>
                <option value="INTERNAL_NOTE">Internal Note</option>
                <option value="EXECUTION_UPDATE">Execution Update</option>
              </select>
            </label>

            <label class="form-field full">
              <span>Work Note *</span>
              <textarea name="note_text" rows="6" required placeholder="Document the action performed, observation, evidence, dependency, or next step..."></textarea>
            </label>
          </div>

          <div id="addWorkNoteMessage" class="form-message hidden"></div>

          <div class="modal-actions">
            <button type="button" class="ghost-btn" id="cancelAddWorkNote">Cancel</button>
            <button type="submit" class="primary-btn" id="submitAddWorkNote">Add Work Note</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeAddWorkNoteModal").addEventListener("click", closeModal);
    document.getElementById("cancelAddWorkNote").addEventListener("click", closeModal);
    document.getElementById("addWorkNoteForm").addEventListener("submit", submitWorkNote);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    const ticketId = getSelectedTicketId();

    if (!ticketId) {
      alert("Select a ticket before adding a work note.");
      return;
    }

    buildModal();

    const modal = document.getElementById("addWorkNoteModal");
    const form = document.getElementById("addWorkNoteForm");
    const message = document.getElementById("addWorkNoteMessage");
    const label = document.getElementById("addWorkNoteTicketLabel");

    form.reset();
    form.querySelector('[name="created_by"]').value = "Romanoti Operator";

    message.className = "form-message hidden";
    message.textContent = "";

    label.innerHTML = `Add an operational note to <strong>${escapeHtml(getSelectedTicketNumber())}</strong>.`;

    modal.dataset.ticketId = ticketId;
    modal.classList.remove("hidden");

    setTimeout(function () {
      form.querySelector('[name="note_text"]').focus();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("addWorkNoteModal");
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

  async function submitWorkNote(event) {
    event.preventDefault();

    const modal = document.getElementById("addWorkNoteModal");
    const form = event.target;
    const message = document.getElementById("addWorkNoteMessage");
    const submitButton = document.getElementById("submitAddWorkNote");
    const ticketId = modal.dataset.ticketId;
    const payload = formToPayload(form);

    if (!ticketId) {
      message.className = "form-message error";
      message.textContent = "No ticket selected.";
      return;
    }

    if (!payload.note_text) {
      message.className = "form-message error";
      message.textContent = "Work note text is required.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Saving...";
      message.className = "form-message";
      message.textContent = "Saving work note...";

      const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/work-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        message.className = "form-message error";
        message.textContent = data.error || "Work note could not be added.";
        return;
      }

      const ticketNumber = data.detail.ticket.ticket_number;

      message.className = "form-message success";
      message.innerHTML = `Work note added to <strong>${escapeHtml(ticketNumber)}</strong>. Refreshing...`;

      setTimeout(function () {
        window.location.reload();
      }, 850);

    } catch (error) {
      message.className = "form-message error";
      message.textContent = "Cannot reach Smart Hands Desk backend on port 8775.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Add Work Note";
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

  function injectAddWorkNoteButton() {
    const actions = findRomanotiActionsContainer();
    if (!actions) return;

    if (actions.querySelector("[data-shd-add-work-note]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "small-btn";
    button.dataset.shdAddWorkNote = "true";
    button.textContent = "Add Work Note";
    button.addEventListener("click", openModal);

    actions.prepend(button);
  }

  function observeTicketDetailChanges() {
    const target = document.getElementById("ticketDetail");
    if (!target) return;

    const observer = new MutationObserver(function () {
      injectAddWorkNoteButton();
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    buildModal();
    injectAddWorkNoteButton();
    observeTicketDetailChanges();

    setTimeout(injectAddWorkNoteButton, 500);
    setTimeout(injectAddWorkNoteButton, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

