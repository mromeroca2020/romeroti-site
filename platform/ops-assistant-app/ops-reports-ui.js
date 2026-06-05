(function () {
  const REPORTS_API_URL = "http://127.0.0.1:8765/api/reports";
  const REPORT_FILE_API_URL = "http://127.0.0.1:8765/api/report-file?file=";

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function addReportStyles() {
    if (document.getElementById("opsReportsStyles")) return;

    const style = document.createElement("style");
    style.id = "opsReportsStyles";
    style.textContent = `
      .saved-reports-panel {
        background: linear-gradient(135deg, rgba(24,31,48,.96), rgba(14,20,34,.98));
        border: 1px solid rgba(139,92,246,.30);
        border-radius: 28px;
        padding: 30px;
        margin: 28px 0;
        box-shadow: 0 24px 70px rgba(0,0,0,.24);
      }

      .saved-reports-panel h2 {
        margin: 0 0 8px;
        font-size: clamp(1.8rem, 2.6vw, 2.8rem);
        letter-spacing: -0.04em;
      }

      .saved-reports-panel p {
        color: #b6c2d4;
        line-height: 1.6;
        margin: 0 0 20px;
      }

      .reports-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-top: 18px;
      }

      .report-item {
        background: rgba(255,255,255,.055);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 20px;
        padding: 20px;
      }

      .report-item h3 {
        margin: 0 0 10px;
        font-size: 1rem;
        word-break: break-word;
      }

      .report-meta {
        color: #b6c2d4;
        font-size: .9rem;
        line-height: 1.5;
        margin-bottom: 14px;
      }

      .report-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .report-viewer {
        margin-top: 22px;
        background: rgba(0,0,0,.25);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 20px;
        padding: 20px;
      }

      .report-viewer-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: center;
        margin-bottom: 12px;
        flex-wrap: wrap;
      }

      .report-viewer pre {
        white-space: pre-wrap;
        word-break: break-word;
        background: #07101a;
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 16px;
        padding: 16px;
        max-height: 520px;
        overflow: auto;
        color: #e5e7eb;
        font: 600 .88rem Consolas, monospace;
      }

      @media (max-width: 900px) {
        .reports-list {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureReportsPanel() {
    let panel = document.getElementById("savedReportsPanel");
    if (panel) return panel;

    panel = document.createElement("section");
    panel.id = "savedReportsPanel";
    panel.className = "saved-reports-panel";
    panel.innerHTML = `
      <div class="panel-kicker">Reports History</div>
      <h2>Saved Final Reports</h2>
      <p>
        Review generated Ops Assistant reports without going back to PowerShell.
        Each saved package includes a TXT report and a JSON technical record.
      </p>

      <div class="ticket-toolbar">
        <button class="ticket-btn primary" id="refreshReportsButton">Refresh Reports</button>
      </div>

      <div id="reportsStatus" class="ticket-status"></div>
      <div id="reportsList" class="reports-list"></div>
      <div id="reportViewer" class="report-viewer" style="display:none;"></div>
    `;

    const main = document.querySelector(".main") || document.body;
    const ticketPanel = document.getElementById("ticketIntelligencePanel");

    if (ticketPanel && ticketPanel.parentNode) {
      ticketPanel.parentNode.insertBefore(panel, ticketPanel.nextSibling);
    } else {
      main.appendChild(panel);
    }

    document.getElementById("refreshReportsButton").addEventListener("click", loadReports);

    return panel;
  }

  async function loadReports() {
    const panel = ensureReportsPanel();
    const status = document.getElementById("reportsStatus");
    const list = document.getElementById("reportsList");

    panel.scrollIntoView({ behavior: "smooth", block: "start" });
    status.textContent = "Loading saved reports...";
    list.innerHTML = "";

    try {
      const response = await fetch(REPORTS_API_URL);
      const data = await response.json();

      if (!data.ok) {
        status.textContent = "Could not load reports.";
        return;
      }

      const reports = data.reports || [];

      if (!reports.length) {
        status.textContent = "No saved reports found yet.";
        return;
      }

      status.textContent = `${reports.length} saved report package(s) found.`;

      list.innerHTML = reports.map((report) => {
        const txtName = report.files?.txt?.name || "";
        const jsonName = report.files?.json?.name || "";

        return `
          <article class="report-item">
            <h3>${escapeHtml(report.id)}</h3>
            <div class="report-meta">
              Modified: ${escapeHtml(report.modified)}<br>
              Total size: ${escapeHtml(report.size_total)} bytes<br>
              TXT: ${txtName ? escapeHtml(txtName) : "Not available"}<br>
              JSON: ${jsonName ? escapeHtml(jsonName) : "Not available"}
            </div>
            <div class="report-actions">
              ${txtName ? `<button class="ticket-btn" data-report-file="${escapeHtml(txtName)}">View TXT</button>` : ""}
              ${jsonName ? `<button class="ticket-btn" data-report-file="${escapeHtml(jsonName)}">View JSON</button>` : ""}
            </div>
          </article>
        `;
      }).join("");

      document.querySelectorAll("[data-report-file]").forEach((button) => {
        button.addEventListener("click", function () {
          viewReportFile(button.dataset.reportFile);
        });
      });

    } catch (error) {
      status.textContent = "Cannot reach Ops Assistant backend. Confirm port 8765 is running.";
      console.error(error);
    }
  }

  async function viewReportFile(fileName) {
    const viewer = document.getElementById("reportViewer");
    viewer.style.display = "block";
    viewer.innerHTML = `
      <div class="report-viewer-header">
        <strong>Loading ${escapeHtml(fileName)}...</strong>
      </div>
    `;

    try {
      const response = await fetch(REPORT_FILE_API_URL + encodeURIComponent(fileName));
      const data = await response.json();

      if (!data.ok) {
        viewer.innerHTML = `<strong>Error:</strong> ${escapeHtml(data.error || "Could not read report file.")}`;
        return;
      }

      viewer.innerHTML = `
        <div class="report-viewer-header">
          <strong>${escapeHtml(data.file)}</strong>
          <button class="ticket-btn" id="copyReportContentButton">Copy Content</button>
        </div>
        <pre id="reportFileContent">${escapeHtml(data.content)}</pre>
      `;

      document.getElementById("copyReportContentButton").addEventListener("click", function () {
        const content = document.getElementById("reportFileContent").innerText;
        navigator.clipboard.writeText(content);
      });

      viewer.scrollIntoView({ behavior: "smooth", block: "start" });

    } catch (error) {
      viewer.innerHTML = "Cannot load report file. Confirm Ops Assistant backend is running.";
      console.error(error);
    }
  }

  function addToolbarButton() {
    const toolbar = document.querySelector(".ticket-toolbar");
    if (!toolbar || document.getElementById("viewSavedReportsButton")) return false;

    const button = document.createElement("button");
    button.id = "viewSavedReportsButton";
    button.className = "ticket-btn";
    button.textContent = "View Saved Reports";
    button.addEventListener("click", loadReports);

    toolbar.appendChild(button);
    return true;
  }

  function wireHistoryButton() {
    document.querySelectorAll(".nav-button").forEach((button) => {
      if (button.textContent.trim().toLowerCase() === "history") {
        button.addEventListener("click", loadReports);
      }
    });
  }

  function initReportsUi() {
    addReportStyles();

    if (!addToolbarButton()) {
      setTimeout(addToolbarButton, 500);
    }

    wireHistoryButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReportsUi);
  } else {
    initReportsUi();
  }
})();
