(function () {
  const API_BASE = "http://127.0.0.1:8775";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function buildModal() {
    if (document.getElementById("createTicketModal")) return;

    const modal = document.createElement("div");
    modal.id = "createTicketModal";
    modal.className = "modal-backdrop hidden";

    modal.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <div>
            <p class="panel-kicker">Create Smart Hands Ticket</p>
            <h3>Create Ticket</h3>
            <p>Create a real SQLite-backed Smart Hands ticket.</p>
          </div>
          <button class="modal-close" id="closeCreateTicketModal" type="button">×</button>
        </div>

        <form id="createTicketForm" class="ticket-form">
          <div class="form-grid">
            <label class="form-field full">
              <span>Title *</span>
              <input name="title" required placeholder="Example: Patch cable validation request" />
            </label>

            <label class="form-field full">
              <span>Description</span>
              <textarea name="description" rows="4" placeholder="Describe what Smart Hands must do..."></textarea>
            </label>

            <label class="form-field">
              <span>Status</span>
              <select name="status">
                <option value="NEW">New</option>
                <option value="READY_FOR_EXECUTION">Ready For Execution</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </label>

            <label class="form-field">
              <span>Priority</span>
              <select name="priority">
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
                <option value="LOW">Low</option>
              </select>
            </label>

            <label class="form-field">
              <span>Task Type</span>
              <select name="task_type">
                <option value="SMART_HANDS">Smart Hands</option>
                <option value="PATCHING">Patching</option>
                <option value="PATCH_VERIFICATION">Patch Verification</option>
                <option value="CONSOLE_ACCESS">Console Access</option>
                <option value="HARDWARE_REPLACEMENT">Hardware Replacement</option>
                <option value="ESCORTING_HOSTING">Escorting / Hosting</option>
                <option value="INBOUND_SHIPMENT">Inbound Shipment</option>
              </select>
            </label>

            <label class="form-field">
              <span>Due Date</span>
              <input name="due_date" type="date" />
            </label>

            <label class="form-field">
              <span>Site</span>
              <input name="site" placeholder="MTL-01" />
            </label>

            <label class="form-field">
              <span>Location</span>
              <input name="location" placeholder="Data Hall A" />
            </label>

            <label class="form-field">
              <span>Rack</span>
              <input name="rack" placeholder="A12" />
            </label>

            <label class="form-field">
              <span>Device</span>
              <input name="device" placeholder="AccessSwitch-01" />
            </label>

            <label class="form-field">
              <span>Port</span>
              <input name="port" placeholder="Eth1/10" />
            </label>

            <label class="form-field">
              <span>Assigned To</span>
              <input name="assigned_to" placeholder="Romanoti Operator" />
            </label>

            <label class="form-field">
              <span>Requester</span>
              <input name="requester" value="Romanoti Requester" />
            </label>

            <label class="form-field">
              <span>Assignment Group</span>
              <input name="assignment_group" value="Romanoti Smart Hands" />
            </label>

            <label class="form-field full">
              <span>Initial Work Note</span>
              <textarea name="initial_work_note" rows="3" placeholder="Initial operational note..."></textarea>
            </label>
          </div>

          <div id="createTicketMessage" class="form-message hidden"></div>

          <div class="modal-actions">
            <button type="button" class="ghost-btn" id="cancelCreateTicket">Cancel</button>
            <button type="submit" class="primary-btn" id="submitCreateTicket">Create Ticket</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeCreateTicketModal").addEventListener("click", closeModal);
    document.getElementById("cancelCreateTicket").addEventListener("click", closeModal);
    document.getElementById("createTicketForm").addEventListener("submit", submitTicket);

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });
  }

  function openModal() {
    buildModal();

    const modal = document.getElementById("createTicketModal");
    const form = document.getElementById("createTicketForm");
    const message = document.getElementById("createTicketMessage");

    form.reset();

    form.querySelector('[name="requester"]').value = "Romanoti Requester";
    form.querySelector('[name="assignment_group"]').value = "Romanoti Smart Hands";

    message.className = "form-message hidden";
    message.textContent = "";

    modal.classList.remove("hidden");

    setTimeout(function () {
      form.querySelector('[name="title"]').focus();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("createTicketModal");
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

  async function submitTicket(event) {
    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("createTicketMessage");
    const submitButton = document.getElementById("submitCreateTicket");
    const payload = formToPayload(form);

    if (!payload.title) {
      message.className = "form-message error";
      message.textContent = "Ticket title is required.";
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Creating...";
      message.className = "form-message";
      message.textContent = "Creating Smart Hands ticket...";

      const response = await fetch(`${API_BASE}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.ok) {
        message.className = "form-message error";
        message.textContent = data.error || "Ticket could not be created.";
        return;
      }

      const createdTicket = data.detail.ticket;

      message.className = "form-message success";
      message.innerHTML = `<strong>${escapeHtml(createdTicket.ticket_number)}</strong> created successfully. Refreshing queue...`;

      setTimeout(function () {
        window.location.reload();
      }, 850);

    } catch (error) {
      message.className = "form-message error";
      message.textContent = "Cannot reach Smart Hands Desk backend on port 8775.";
      console.error(error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Create Ticket";
    }
  }

  function interceptCreateTicketButton() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest("button");
      if (!button) return;

      if (button.closest("#createTicketModal")) return;

      const label = button.textContent.trim().toLowerCase();

      if (label === "create ticket") {
        event.preventDefault();
        event.stopImmediatePropagation();
        openModal();
      }
    }, true);
  }

  window.openSmartHandsCreateTicketModal = openModal;

  function init() {
    buildModal();
    interceptCreateTicketButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();




