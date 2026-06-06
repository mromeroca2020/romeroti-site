(function () {
  const ANALYZE_API_URL = "http://127.0.0.1:8765/api/analyze-ticket";
  const SAVE_REPORT_API_URL = "http://127.0.0.1:8765/api/save-report";

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .ticket-intel-panel {
        background: linear-gradient(135deg, rgba(31,41,55,.96), rgba(17,24,39,.98));
        border: 1px solid rgba(139,92,246,.28);
        border-radius: 28px;
        padding: 34px;
        margin-bottom: 28px;
        box-shadow: 0 24px 70px rgba(0,0,0,.24);
      }

      .ticket-intel-panel h2 {
        margin: 0 0 10px;
        font-size: clamp(2rem, 3vw, 3.2rem);
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .ticket-intel-panel p {
        color: #b6c2d4;
        line-height: 1.6;
        max-width: 940px;
      }

      .ticket-toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 20px 0;
      }

      .ticket-btn {
        min-height: 46px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.14);
        padding: 0 18px;
        font: inherit;
        font-weight: 900;
        cursor: pointer;
        background: rgba(255,255,255,.08);
        color: #f8fafc;
      }

      .ticket-btn.primary {
        background: #8b5cf6;
        color: #ffffff;
        border-color: transparent;
      }

      .ticket-btn.warning {
        background: #f59e0b;
        color: #111827;
        border-color: transparent;
      }

      .ticket-input {
        width: 100%;
        min-height: 220px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,.16);
        background: #07101a;
        color: #f8fafc;
        padding: 18px;
        font: 600 0.95rem Consolas, monospace;
        outline: none;
        resize: vertical;
      }

      .ticket-input:focus {
        border-color: rgba(139,92,246,.7);
        box-shadow: 0 0 0 4px rgba(139,92,246,.12);
      }

      .ticket-status {
        min-height: 24px;
        margin-top: 12px;
        color: #c4b5fd;
        font-weight: 800;
      }

      .ticket-results {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
        margin-top: 24px;
      }

      .ticket-card {
        background: rgba(255,255,255,.055);
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 22px;
        padding: 22px;
      }

      .ticket-card.full {
        grid-column: 1 / -1;
      }

      .ticket-card h3 {
        margin: 0 0 12px;
        font-size: 1.15rem;
      }

      .ticket-card pre {
        white-space: pre-wrap;
        word-break: break-word;
        background: rgba(0,0,0,.24);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 16px;
        padding: 16px;
        color: #e5e7eb;
        max-height: 360px;
        overflow: auto;
        font: 600 .88rem Consolas, monospace;
      }

      .ticket-pill {
        display: inline-flex;
        margin: 4px 6px 4px 0;
        min-height: 32px;
        align-items: center;
        border-radius: 999px;
        padding: 0 12px;
        background: rgba(139,92,246,.16);
        color: #ddd6fe;
        font-weight: 900;
        font-size: .82rem;
      }

      .status-ok { color: #86efac; }
      .status-warning { color: #fde68a; }
      .status-error { color: #fca5a5; }

      @media (max-width: 900px) {
        .ticket-results {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function sampleTicket() {
    return `STASK1234567
Label: CORE-SW01-A09 RU38-Eth1/49 -> PATCHPANEL-A09 RU12-P34
Redundancy: SI
Path: P2
PortTypeA: SFP+
OpticA: SR
PortTypeB: SFP+
OpticB: SR
Cable: OM3/OM4
Notes: Verify patch connection, capture evidence, and update ServiceNow work notes.`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function copyText(id) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText || el.textContent || "");
  }

  function renderResults(data) {
    const results = document.getElementById("ticketResults");
    const validation = data.physical?.validation || {};
    const status = validation.status || "UNKNOWN";
    const statusClass =
      status === "OK" ? "status-ok" :
      status === "WARNING" ? "status-warning" :
      status === "ERROR" ? "status-error" : "";

    const checklist = data.outputs?.checklist || [];

    results.innerHTML = `
      <div class="ticket-card">
        <h3>Detected Ticket</h3>
        <div>
          <span class="ticket-pill">${escapeHtml(data.ticket?.stask)}</span>
          <span class="ticket-pill">${escapeHtml(data.ticket?.work_type)}</span>
        </div>
        <pre>${escapeHtml(JSON.stringify(data.endpoints, null, 2))}</pre>
      </div>

      <div class="ticket-card">
        <h3>Physical Validation</h3>
        <p class="${statusClass}"><strong>${escapeHtml(status)}</strong></p>
        <pre>${escapeHtml(validation.message || "")}</pre>
      </div>

      <div class="ticket-card full">
        <h3>Smart Hands Checklist</h3>
        <pre>${escapeHtml(checklist.map((item, i) => `${i + 1}. ${item}`).join("\\n"))}</pre>
      </div>

      <div class="ticket-card full">
        <h3>Generated Runbook</h3>
        <button class="ticket-btn" onclick="navigator.clipboard.writeText(document.getElementById('runbookOutput').innerText)">Copy Runbook</button>
        <pre id="runbookOutput">${escapeHtml(data.outputs?.runbook || "")}</pre>
      </div>

      <div class="ticket-card">
        <h3>Ticket Summary</h3>
        <button class="ticket-btn" onclick="navigator.clipboard.writeText(document.getElementById('summaryOutput').innerText)">Copy Summary</button>
        <pre id="summaryOutput">${escapeHtml(data.outputs?.ticket_summary || "")}</pre>
      </div>

      <div class="ticket-card">
        <h3>Closure Note</h3>
        <button class="ticket-btn" onclick="navigator.clipboard.writeText(document.getElementById('closureOutput').innerText)">Copy Closure</button>
        <pre id="closureOutput">${escapeHtml(data.outputs?.closure_note || "")}</pre>
      </div>
    `;
  }

  async function analyzeTicket() {
    const textarea = document.getElementById("ticketText");
    const status = document.getElementById("ticketStatus");
    const text = textarea.value.trim();

    if (!text) {
      status.textContent = "Paste a ServiceNow/SCTASK ticket first.";
      return;
    }

    status.textContent = "Analyzing ticket with Ops Assistant backend...";

    try {
      const response = await fetch(ANALYZE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticket_text: text
        })
      });

      const data = await response.json();

      if (!data.ok) {
        status.textContent = "Backend error: " + (data.error || "Unknown error");
        return;
      }

      status.textContent = "Ticket analyzed successfully.";
      renderResults(data);
    } catch (error) {
      status.textContent = "Cannot reach Ops Assistant backend. Confirm py server.py is running on port 8765.";
      console.error(error);
    }
  }


  async function saveFinalReport() {
    const textarea = document.getElementById("ticketText");
    const status = document.getElementById("ticketStatus");
    const text = textarea.value.trim();

    if (!text) {
      status.textContent = "Paste or load a ServiceNow/SCTASK ticket before saving a report.";
      return;
    }

    status.textContent = "Saving final report with Ops Assistant backend...";

    try {
      const response = await fetch(SAVE_REPORT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticket_text: text
        })
      });

      const data = await response.json();

      if (!data.ok) {
        status.textContent = "Backend error while saving report: " + (data.error || "Unknown error");
        return;
      }

      renderResults(data);

      const report = data.saved_report || {};
      const results = document.getElementById("ticketResults");

      results.insertAdjacentHTML("afterbegin", `
        <div class="ticket-card full">
          <h3>Final Report Saved</h3>
          <p class="status-ok"><strong>Report generated successfully.</strong></p>
          <pre>TXT: ${escapeHtml(report.txt || "Not returned")}
JSON: ${escapeHtml(report.json || "Not returned")}</pre>
        </div>
      `);

      status.textContent = "Final report saved successfully.";
    } catch (error) {
      status.textContent = "Cannot save report. Confirm Ops Assistant backend is running on port 8765.";
      console.error(error);
    }
  }
  function buildPanel() {
    if (document.getElementById("ticketIntelligencePanel")) return;

    const panel = document.createElement("section");
    panel.id = "ticketIntelligencePanel";
    panel.className = "ticket-intel-panel";
    panel.innerHTML = `
      <div class="panel-kicker">Ticket Intelligence & Smart Hands Advisor</div>
      <h2>Paste a ServiceNow ticket and generate the operator package.</h2>
      <p>
        Ops Assistant reads ServiceNow/SCTASK text or ticket notes, detects labels/endpoints,
        validates physical compatibility, and generates a Smart Hands checklist, runbook,
        ticket summary, and closure note.
      </p>

      <div class="ticket-toolbar">
        <button class="ticket-btn warning" id="sampleTicketButton">Load Sample Ticket</button>
        <button class="ticket-btn primary" id="analyzeTicketButton">Analyze Ticket</button>
        <button class="ticket-btn primary" id="saveReportButton">Save Final Report</button>
        <button class="ticket-btn" id="clearTicketButton">Clear</button>
      </div>

      <textarea id="ticketText" class="ticket-input" placeholder="Paste ServiceNow / SCTASK ticket text here..."></textarea>
      <div id="ticketStatus" class="ticket-status"></div>
      <div id="ticketResults" class="ticket-results"></div>
    `;

    const main = document.querySelector(".main") || document.body;
    const hero = document.querySelector(".hero-panel");

    if (hero && hero.parentNode) {
      hero.parentNode.insertBefore(panel, hero);
    } else {
      main.prepend(panel);
    }

    document.getElementById("sampleTicketButton").addEventListener("click", function () {
      document.getElementById("ticketText").value = sampleTicket();
      document.getElementById("ticketStatus").textContent = "Sample ticket loaded.";
    });

    document.getElementById("analyzeTicketButton").addEventListener("click", analyzeTicket);
    document.getElementById("saveReportButton").addEventListener("click", saveFinalReport);

    document.getElementById("clearTicketButton").addEventListener("click", function () {
      document.getElementById("ticketText").value = "";
      document.getElementById("ticketStatus").textContent = "";
      document.getElementById("ticketResults").innerHTML = "";
    });
  }

  addStyles();
  buildPanel();
})();

