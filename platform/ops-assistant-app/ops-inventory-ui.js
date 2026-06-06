(function () {
  const INVENTORY_API_URL = "http://127.0.0.1:8765/api/analyze-ticket";

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function addInventoryStyles() {
    if (document.getElementById("opsInventoryAdvisorStyles")) return;

    const style = document.createElement("style");
    style.id = "opsInventoryAdvisorStyles";
    style.textContent = `
      #inventoryAdvisorCard {
        border-color: rgba(34,211,238,.35);
        background: linear-gradient(135deg, rgba(14,31,45,.92), rgba(17,24,39,.96));
      }

      .inventory-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin: 14px 0 16px;
      }

      .inventory-kpi {
        border: 1px solid rgba(255,255,255,.12);
        background: rgba(255,255,255,.055);
        border-radius: 16px;
        padding: 14px;
      }

      .inventory-kpi strong {
        display: block;
        color: #67e8f9;
        margin-bottom: 6px;
        font-size: .82rem;
        text-transform: uppercase;
        letter-spacing: .08em;
      }

      .inventory-kpi span {
        color: #f8fafc;
        font-weight: 900;
      }

      .inventory-hint-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        margin-top: 14px;
      }

      .inventory-note {
        color: #cbd5e1;
        margin-top: 12px;
        line-height: 1.6;
      }

      @media (max-width: 900px) {
        .inventory-grid,
        .inventory-hint-grid {
          grid-template-columns: 1fr;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function findCardByTitle(titleText) {
    const expected = String(titleText || "").toLowerCase();

    for (const heading of document.querySelectorAll(".ticket-card h3")) {
      if (String(heading.textContent || "").toLowerCase().includes(expected)) {
        return heading.closest(".ticket-card");
      }
    }

    return null;
  }

  function formatHint(hint) {
    if (!hint) {
      return "No inventory port hint found.";
    }

    return JSON.stringify(hint, null, 2);
  }

  function renderInventoryAdvisor(data) {
    const results = document.getElementById("ticketResults");
    if (!results) return false;

    const inventory = data.inventory || {};
    const existing = document.getElementById("inventoryAdvisorCard");
    if (existing) existing.remove();

    const rackPair = inventory.rack_pair
      ? `${inventory.rack_pair.source_rack || "N/A"} ↔ ${inventory.rack_pair.paired_rack || "N/A"}`
      : "Not detected";

    const notes = Array.isArray(inventory.notes) && inventory.notes.length
      ? inventory.notes.map((item) => `- ${item}`).join("\n")
      : "No advisory notes.";

    const card = document.createElement("div");
    card.id = "inventoryAdvisorCard";
    card.className = "ticket-card full";
    card.innerHTML = `
      <h3>Inventory / Cable Advisor</h3>

      <div class="inventory-grid">
        <div class="inventory-kpi">
          <strong>Inventory Loaded</strong>
          <span>${inventory.inventory_loaded ? "YES" : "NO"}</span>
        </div>

        <div class="inventory-kpi">
          <strong>Rack Pair</strong>
          <span>${escapeHtml(rackPair)}</span>
        </div>

        <div class="inventory-kpi">
          <strong>Suggested Cable</strong>
          <span>${escapeHtml(inventory.suggested_cable_final || "Not available")}</span>
        </div>
      </div>

      <div class="inventory-hint-grid">
        <div>
          <h3 style="font-size:1rem;margin-top:0;">Endpoint A Inventory Hint</h3>
          <pre>${escapeHtml(formatHint(inventory.endpoint_a_hint))}</pre>
        </div>

        <div>
          <h3 style="font-size:1rem;margin-top:0;">Endpoint B Inventory Hint</h3>
          <pre>${escapeHtml(formatHint(inventory.endpoint_b_hint))}</pre>
        </div>
      </div>

      <div class="inventory-note">
        <strong>Advisor Notes</strong>
        <pre>${escapeHtml(notes)}</pre>
      </div>
    `;

    const physicalCard = findCardByTitle("Physical Validation");

    if (physicalCard && physicalCard.parentNode) {
      physicalCard.parentNode.insertBefore(card, physicalCard.nextSibling);
    } else {
      results.prepend(card);
    }

    return true;
  }

  function waitAndRender(data, attemptsLeft) {
    if (renderInventoryAdvisor(data)) return;

    if (attemptsLeft <= 0) return;

    setTimeout(function () {
      waitAndRender(data, attemptsLeft - 1);
    }, 250);
  }

  async function loadInventoryAdvisor() {
    const textarea = document.getElementById("ticketText");
    if (!textarea) return;

    const text = textarea.value.trim();
    if (!text) return;

    try {
      const response = await fetch(INVENTORY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ticket_text: text
        })
      });

      const data = await response.json();

      if (!data.ok) return;

      waitAndRender(data, 10);
    } catch (error) {
      console.error("Inventory Advisor could not load:", error);
    }
  }

  function wireInventoryAdvisor() {
    addInventoryStyles();

    const analyzeButton = document.getElementById("analyzeTicketButton");
    const saveButton = document.getElementById("saveReportButton");

    if (analyzeButton && !analyzeButton.dataset.inventoryAdvisorWired) {
      analyzeButton.dataset.inventoryAdvisorWired = "true";
      analyzeButton.addEventListener("click", function () {
        setTimeout(loadInventoryAdvisor, 900);
      });
    }

    if (saveButton && !saveButton.dataset.inventoryAdvisorWired) {
      saveButton.dataset.inventoryAdvisorWired = "true";
      saveButton.addEventListener("click", function () {
        setTimeout(loadInventoryAdvisor, 900);
      });
    }
  }

  function init() {
    wireInventoryAdvisor();

    // In case buttons were created after this script loaded
    setTimeout(wireInventoryAdvisor, 500);
    setTimeout(wireInventoryAdvisor, 1000);
    setTimeout(wireInventoryAdvisor, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
