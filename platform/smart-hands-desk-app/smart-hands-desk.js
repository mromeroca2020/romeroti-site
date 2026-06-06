(function () {
  const API_BASE = "http://127.0.0.1:8775";

  let allTickets = [];
  let currentFilter = "dashboard";

  const queueLabels = {
    dashboard: {
      title: "Operations Queue",
      subtitle: "Lightweight ticket execution for Smart Hands work, evidence, notes, approvals and closure.",
      panel: "Active Smart Hands Tickets"
    },
    assigned: {
      title: "Assigned to Me",
      subtitle: "Tickets currently assigned to a Smart Hands operator.",
      panel: "Assigned Smart Hands Tickets"
    },
    unassigned: {
      title: "Unassigned Queue",
      subtitle: "Tickets waiting for assignment before execution.",
      panel: "Unassigned Smart Hands Tickets"
    },
    ready: {
      title: "Ready for Execution",
      subtitle: "Tickets reviewed and ready for Smart Hands execution.",
      panel: "Execution-ready Tickets"
    },
    onhold: {
      title: "On Hold",
      subtitle: "Tickets waiting for clarification, approval, material, or external dependency.",
      panel: "On Hold Smart Hands Tickets"
    },
    closed: {
      title: "Closed Tickets",
      subtitle: "Completed Smart Hands tickets and historical execution records.",
      panel: "Closed Smart Hands Tickets"
    }
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }


  function formatDateTime(value) {
    if (!value) return "";

    const raw = String(value);

    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);

    if (match) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const year = match[1];
      const month = months[Number(match[2]) - 1] || match[2];
      const day = match[3];
      const hour = match[4];
      const minute = match[5];

      return `${month} ${day}, ${year} · ${hour}:${minute}`;
    }

    const parsed = new Date(raw);

    if (Number.isNaN(parsed.getTime())) {
      return raw;
    }

    return parsed.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
  function pretty(value) {
    return String(value || "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function statusClass(status) {
    if (status === "READY_FOR_EXECUTION") return "ready";
    if (status === "IN_PROGRESS") return "progress";
    if (status === "ON_HOLD") return "hold";
    if (status === "CLOSED") return "muted";
    return "muted";
  }

  function priorityClass(priority) {
    if (priority === "URGENT") return "urgent";
    if (priority === "HIGH") return "hold";
    return "muted";
  }

  function getFilteredTickets() {
    if (currentFilter === "assigned") {
      return allTickets.filter((ticket) => ticket.assigned_to && ticket.assigned_to.trim() !== "");
    }

    if (currentFilter === "unassigned") {
      return allTickets.filter((ticket) => !ticket.assigned_to || ticket.assigned_to.trim() === "");
    }

    if (currentFilter === "ready") {
      return allTickets.filter((ticket) => ticket.status === "READY_FOR_EXECUTION");
    }

    if (currentFilter === "onhold") {
      return allTickets.filter((ticket) => ticket.status === "ON_HOLD");
    }

    if (currentFilter === "closed") {
      return allTickets.filter((ticket) => ticket.status === "CLOSED");
    }

    return allTickets;
  }

  function updateQueueHeader() {
    const config = queueLabels[currentFilter] || queueLabels.dashboard;

    const pageTitle = document.querySelector(".topbar h2");
    const subtitle = document.querySelector(".subtitle");
    const panelTitle = document.querySelector(".tickets-panel .panel-header h3");

    if (pageTitle) pageTitle.textContent = config.title;
    if (subtitle) subtitle.textContent = config.subtitle;
    if (panelTitle) panelTitle.textContent = config.panel;
  }

  function renderCounts(counts) {
    const container = document.getElementById("statusCounts");
    if (!container) return;

    if (!counts || !counts.length) {
      container.innerHTML = `<div class="count-row"><span>No tickets</span><strong>0</strong></div>`;
      return;
    }

    container.innerHTML = counts.map((item) => `
      <div class="count-row">
        <span>${escapeHtml(pretty(item.status))}</span>
        <strong>${escapeHtml(item.total)}</strong>
      </div>
    `).join("");
  }

  function clearDetail(message) {
    const title = document.getElementById("detailTitle");
    const status = document.getElementById("detailStatus");
    const container = document.getElementById("ticketDetail");

    if (title) title.textContent = "No ticket selected";
    if (status) {
      status.textContent = "Waiting";
      status.className = "badge muted";
    }

    if (container) {
      container.innerHTML = `<div class="ticket-detail-empty">${escapeHtml(message || "Select a Smart Hands ticket from the queue to review details.")}</div>`;
    }
  }

  function renderTickets() {
    updateQueueHeader();

    const container = document.getElementById("ticketsTable");
    const badge = document.getElementById("ticketCountBadge");
    const tickets = getFilteredTickets();

    if (!container || !badge) return;

    badge.textContent = `${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`;

    if (!tickets.length) {
      container.innerHTML = `<div class="ticket-detail-empty">No tickets found in this queue.</div>`;
      clearDetail("No ticket available for this queue.");
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Location</th>
            <th>Assigned</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map((ticket) => `
            <tr class="ticket-row" data-ticket-id="${ticket.id}">
              <td><div class="ticket-number">${escapeHtml(ticket.ticket_number)}</div></td>
              <td>
                <div class="ticket-title">${escapeHtml(ticket.title)}</div>
                <div class="ticket-sub">${escapeHtml(pretty(ticket.task_type))}</div>
              </td>
              <td><span class="badge ${statusClass(ticket.status)}">${escapeHtml(pretty(ticket.status))}</span></td>
              <td><span class="badge ${priorityClass(ticket.priority)}">${escapeHtml(pretty(ticket.priority))}</span></td>
              <td>
                <div>${escapeHtml(ticket.site || "N/A")}</div>
                <div class="ticket-sub">${escapeHtml(ticket.rack || "")} ${escapeHtml(ticket.device || "")}</div>
              </td>
              <td>${escapeHtml(ticket.assigned_to || "Unassigned")}</td>
              <td>${escapeHtml(ticket.due_date || "N/A")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    document.querySelectorAll(".ticket-row").forEach((row) => {
      row.addEventListener("click", function () {
        document.querySelectorAll(".ticket-row").forEach((item) => item.classList.remove("selected-row"));
        row.classList.add("selected-row");
        loadTicketDetail(row.dataset.ticketId);
      });
    });

    const firstRow = document.querySelector(".ticket-row");
    if (firstRow) {
      firstRow.classList.add("selected-row");
      loadTicketDetail(firstRow.dataset.ticketId);
    }
  }

  function renderCollection(title, items, emptyText, renderItem) {
    const content = items && items.length
      ? items.map(renderItem).join("")
      : `<div class="ticket-sub">${emptyText}</div>`;

    return `
      <div class="detail-section">
        <h4>${escapeHtml(title)}</h4>
        ${content}
      </div>
    `;
  }

  async function loadTicketDetail(ticketId) {
    const title = document.getElementById("detailTitle");
    const status = document.getElementById("detailStatus");
    const container = document.getElementById("ticketDetail");

    if (title) title.textContent = "Loading ticket...";
    if (status) {
      status.textContent = "Loading";
      status.className = "badge muted";
    }
    if (container) {
      container.innerHTML = `<div class="ticket-detail-empty">Loading detail from Smart Hands Desk backend...</div>`;
    }

    try {
      const response = await fetch(`${API_BASE}/api/tickets/${ticketId}`);
      const data = await response.json();

      if (!data.ok) {
        clearDetail("Ticket could not be loaded.");
        return;
      }

      const detail = data.detail;
      const ticket = detail.ticket;

      title.textContent = `${ticket.ticket_number}`;
      status.textContent = pretty(ticket.status);
      status.className = `badge ${statusClass(ticket.status)}`;

      container.innerHTML = `
        <div class="detail-section">
          <h4>${escapeHtml(ticket.title)}</h4>
          <p class="ticket-sub">${escapeHtml(ticket.description || "")}</p>

          <div class="field-grid">
            <div class="field"><strong>Status</strong><span>${escapeHtml(pretty(ticket.status))}</span></div>
            <div class="field"><strong>Priority</strong><span>${escapeHtml(pretty(ticket.priority))}</span></div>
            <div class="field"><strong>Site</strong><span>${escapeHtml(ticket.site || "N/A")}</span></div>
            <div class="field"><strong>Location</strong><span>${escapeHtml(ticket.location || "N/A")}</span></div>
            <div class="field"><strong>Rack</strong><span>${escapeHtml(ticket.rack || "N/A")}</span></div>
            <div class="field"><strong>Device / Port</strong><span>${escapeHtml(ticket.device || "N/A")} / ${escapeHtml(ticket.port || "N/A")}</span></div>
            <div class="field"><strong>Assignment Group</strong><span>${escapeHtml(ticket.assignment_group || "N/A")}</span></div>
            <div class="field"><strong>Assigned To</strong><span>${escapeHtml(ticket.assigned_to || "Unassigned")}</span></div>
            <div class="field"><strong>Requester</strong><span>${escapeHtml(ticket.requester || "N/A")}</span></div>
            <div class="field"><strong>Due Date</strong><span>${escapeHtml(ticket.due_date || "N/A")}</span></div>
          </div>
        </div>

        <div class="detail-section">
          <h4>Romanoti Actions</h4>
          <div class="integration-actions">
            <button class="small-btn">Analyze with Ops Assistant</button>
            <button class="small-btn">Open RIV Context</button>
            <button class="small-btn">Check Inventory</button>
            <button class="small-btn">Generate Closure Note</button>
          </div>
        </div>

        ${renderCollection("Work Notes", detail.work_notes, "No work notes yet.", (item) => `
          <div class="note">
            <strong>${escapeHtml(item.created_by)}</strong> · ${escapeHtml(formatDateTime(item.created_at))}
            <br>${escapeHtml(item.note_text)}
          </div>
        `)}

        ${renderCollection("Hold Comments", detail.hold_comments, "No hold comments.", (item) => `
          <div class="note">
            <strong>${escapeHtml(item.hold_reason || "Hold")}</strong>
            <br>${escapeHtml(item.comment_text)}
          </div>
        `)}

        ${renderCollection("Attachments / Evidence", detail.attachments, "No attachments yet.", (item) => `
          <div class="note">${escapeHtml(item.file_name)} · ${escapeHtml(item.uploaded_at)}</div>
        `)}

        ${renderCollection("Affected CIs", detail.affected_cis, "No affected CIs.", (item) => `
          <div class="note">
            ${escapeHtml(item.ci_name)} · ${escapeHtml(item.ci_type || "CI")}
            <br>${escapeHtml(item.rack || "")} ${escapeHtml(item.device || "")} ${escapeHtml(item.port || "")}
          </div>
        `)}

        ${renderCollection("Approvals", detail.approvals, "No approvals attached.", (item) => `
          <div class="note">${escapeHtml(item.approver)} · ${escapeHtml(item.status)}</div>
        `)}

        ${renderCollection("Task SLAs", detail.task_slas, "No SLA records.", (item) => `
          <div class="note">${escapeHtml(item.sla_name)} · ${escapeHtml(item.status)} · Target: ${escapeHtml(item.target_time || "N/A")}</div>
        `)}

        ${renderCollection("Attached Knowledge", detail.knowledge_links, "No knowledge articles attached.", (item) => `
          <div class="note">${escapeHtml(item.title)}<br>${escapeHtml(item.notes || "")}</div>
        `)}

        ${renderCollection("Ticket History", detail.history, "No history yet.", (item) => `
          <div class="note">
            <strong>${escapeHtml(item.event_type)}</strong> · ${escapeHtml(formatDateTime(item.created_at))}
            <br>${escapeHtml(item.event_text)}
          </div>
        `)}
      `;
    } catch (error) {
      clearDetail("Cannot reach Smart Hands Desk backend on port 8775.");
      console.error(error);
    }
  }

  async function loadTickets() {
    const table = document.getElementById("ticketsTable");
    if (table) table.innerHTML = "Loading tickets from Smart Hands Desk backend...";

    try {
      const response = await fetch(`${API_BASE}/api/tickets`);
      const data = await response.json();

      if (!data.ok) {
        if (table) table.innerHTML = `<div class="ticket-detail-empty">Backend returned an error.</div>`;
        return;
      }

      allTickets = data.tickets || [];
      renderCounts(data.counts || []);
      renderTickets();
    } catch (error) {
      if (table) {
        table.innerHTML = `<div class="ticket-detail-empty">Cannot reach backend. Confirm port 8775 is running.</div>`;
      }
      console.error(error);
    }
  }

  function wireNavigation() {
    document.querySelectorAll(".nav-button").forEach((button) => {
      button.addEventListener("click", function () {
        document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.view || "dashboard";
        renderTickets();
      });
    });
  }

  function wireButtons() {
    const refresh = document.getElementById("refreshTicketsButton");
    if (refresh) refresh.addEventListener("click", loadTickets);

    document.querySelectorAll(".ghost-btn").forEach((button) => {
      button.addEventListener("click", function () {
        if (window.openSmartHandsCreateTicketModal) { window.openSmartHandsCreateTicketModal(); } else { alert("Create Ticket form is not loaded. Please refresh the page and try again."); }
      });
    });
  }

  function init() {
    wireNavigation();
    wireButtons();
    loadTickets();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


