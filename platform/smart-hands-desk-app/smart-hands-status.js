(function () {
  const API_BASE = "http://127.0.0.1:8775";

  const STATUS_OPTIONS = [
    { value: "NEW", label: "New" },
    { value: "IN_REVIEW", label: "In Review" },
    { value: "READY_FOR_EXECUTION", label: "Ready For Execution" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CLOSED", label: "Closed" }
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function prettyStatus(value) {
    return String(value || "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
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

  function getCurrentDetailStatus() {
    const badge = document.querySelector("#ticketDetail .status-pill, #ticketDetail .detail-status, #ticketDetail [data-status]");

    if (badge && badge.dataset.status) {
      return badge.dataset.status;
    }

    const detailText = document.getElementById("ticketDetail")?.textContent || "";

    for (const option of STATUS_OPTIONS) {
      if (detailText.includes(option.label)) {
        return option.value;
      }
    }

    return "";
  }

  function buildModal() {
    if (document.getElementById("changeStatusModal")) return;

    const modal = document.createElement("div");
    modal.id = "changeStatusModal";
    modal.className = "modal-backdrop hidden";

    modal.innerHTML = `
      <div class="modal-card work-note-modal-card">
        <div class="modal-header">
          <div>
            <p class="panel-kicker">Smart Hands Desk</p>
            <h3>Change Ticket Status</h3>
            <p id="changeStatusTicketLabel">Update status for the selected ticket.</p>
          </div>
          <button class="modal-close" id="closeChangeStatusModal" type="button">×</button>
        </div>

        <form id="changeStatusForm" class="ticket-form">
          <div class="form-grid">
            <label class="form-field">
              <span>New Status *</span>
              <select name="status" required>
                ${STATUS_OPTIONS.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
              </select>
            </label>

            <label class="form-field">
              <span>Updated By</span>
              <input name="updated_by" value="Romanoti Operator" />
            </label>

            <label class="form-field full">
              <span>Status Comment</span>
              <textarea name="status_comment" rows="5" placeholder="Optional operational reason, dependency, evidence, or next step..."></textarea>
            </label>
          </div>

          <div id="changeStatusMessage" class="form-message hidden"></div>

          <div class="modal-actions">
            <button type="button" class="ghost-btn" id="cancelChangeStatus">Cancel</button>
            <button type="submit" class="primary-btn" id="submitChangeStatus">Update Status</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeChangeStatusModal").addEventListener("click", closeModal);
    document.getElementById("cancelChangeStatus").addEventListener("click", closeModal);
    document.getElementById("changeStatusForm").addEventListener("submit", submitStatus);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    const ticketId = getSelectedTicketId();

    if (!ticketId) {
      alert("Select a ticket before changing status.");
      return;
    }

    buildModal();

    const modal = document.getElementById("changeStatusModal");
    const form = document.getElementById("changeStatusForm");
    const message = document.getElementById("changeStatusMessage");
    const label = document.getElementById("changeStatusTicketLabel");
    const statusSelect = form.querySelector('[name="status"]');

    form.reset();
    form.querySelector('[name="updated_by"]').value = "Romanoti Operator";

    const currentStatus = getCurrentDetailStatus();
    if (currentStatus) {
      statusSelect.value = currentStatus;
    }

    message.className = "form-message hidden";
    message.textContent = "";

    label.innerHTML = `Update status for <strong>${escapeHtml(getSelectedTicketNumber())}</strong>.`;

    modal.dataset.ticketId = ticketId;
    modal.classList.remove("hidden");

    setTimeout(function () {
      statusSelect.focus();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("changeStatusModal");
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

  async function submitStatus(event) {
    event.preventDefault();

    const modal = document.getElementById("changeStatusModal");
    const form = event.target;
    const message = document.getElementById("changeStatusMessage");
    const submitButton = document.getElementById("submitChangeStatus");
    const ticketId = modal.dataset.ticketId;
    const payload = formToPayload(form);

    if (!ticketId) {
      message.className = "form-message error";
      message.textContent = "No ticket selected.";
      return;
    }

    if (!payload.status) {
      message.className = "form-message error";
      message.textContent = "New status is required.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Updating...";
      message.className = "form-message";
      message.textContent = "Updating ticket status...";

      const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        message.className = "form-message error";
        message.textContent = data.error || "Ticket status could not be updated.";
        return;
      }

      const ticketNumber = data.detail.ticket.ticket_number;
      const newStatus = prettyStatus(data.detail.ticket.status);

      message.className = "form-message success";
      message.innerHTML = `<strong>${escapeHtml(ticketNumber)}</strong> moved to <strong>${escapeHtml(newStatus)}</strong>. Refreshing...`;

      setTimeout(function () {
        window.location.reload();
      }, 850);

    } catch (error) {
      message.className = "form-message error";
      message.textContent = "Cannot reach Smart Hands Desk backend on port 8775.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Update Status";
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

  function injectChangeStatusButton() {
    const actions = findRomanotiActionsContainer();
    if (!actions) return;

    if (actions.querySelector("[data-shd-change-status]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "small-btn";
    button.dataset.shdChangeStatus = "true";
    button.textContent = "Change Status";
    button.addEventListener("click", openModal);

    actions.prepend(button);
  }

  function observeTicketDetailChanges() {
    const target = document.getElementById("ticketDetail");
    if (!target) return;

    const observer = new MutationObserver(function () {
      injectChangeStatusButton();
    });

    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    buildModal();
    injectChangeStatusButton();
    observeTicketDetailChanges();

    setTimeout(injectChangeStatusButton, 500);
    setTimeout(injectChangeStatusButton, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
