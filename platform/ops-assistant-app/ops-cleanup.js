(function () {
  function applyOpsAssistantCleanup() {
    // Rename the app header to match the real function
    const title = document.querySelector(".page-title");
    if (title) {
      title.textContent = "Ticket Intelligence";
    }

    const subtitle = document.querySelector(".page-subtitle");
    if (subtitle) {
      subtitle.textContent =
        "Paste a ServiceNow/SCTASK ticket or work note, then generate the Smart Hands runbook, checklist, operational summary, and closure note.";
    }

    const kicker = document.querySelector(".kicker");
    if (kicker) {
      kicker.textContent = "Romanoti Ops Assistant / Smart Hands Advisor";
    }

    // Update sidebar labels to match real Ops Assistant purpose
    const labels = document.querySelectorAll(".nav-button");
    const newLabels = [
      "Ticket Intake",
      "Generated Runbook",
      "Smart Hands Checklist",
      "Ticket Summary",
      "Closure Notes",
      "History",
      "Settings"
    ];

    labels.forEach((button, index) => {
      if (newLabels[index]) {
        button.textContent = newLabels[index];
      }
    });

    // Hide old generic shell sections now that Ticket Intelligence is functional
    const oldHero = document.querySelector(".hero-panel");
    if (oldHero) oldHero.style.display = "none";

    const oldMetrics = document.querySelector(".grid-cards");
    if (oldMetrics) oldMetrics.style.display = "none";

    const oldModules = document.querySelector(".module-grid");
    if (oldModules) oldModules.style.display = "none";

    // Fix checklist formatting if literal \n appears
    const observer = new MutationObserver(() => {
      const cards = document.querySelectorAll(".ticket-card pre");
      cards.forEach((pre) => {
        if (pre.textContent && pre.textContent.includes("\\n")) {
          pre.textContent = pre.textContent.replaceAll("\\n", "\n");
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyOpsAssistantCleanup);
  } else {
    applyOpsAssistantCleanup();
  }
})();
