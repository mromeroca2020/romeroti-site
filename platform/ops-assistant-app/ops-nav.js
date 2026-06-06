(function () {
  function normalize(text) {
    return String(text || "").trim().toLowerCase();
  }

  function scrollToElement(element) {
    if (!element) return false;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return true;
  }

  function findCardByTitle(titleText) {
    const expected = normalize(titleText);

    const headings = document.querySelectorAll(".ticket-card h3, .saved-reports-panel h2");

    for (const heading of headings) {
      if (normalize(heading.textContent).includes(expected)) {
        return heading.closest(".ticket-card") || heading.closest(".saved-reports-panel");
      }
    }

    return null;
  }

  function showStatus(message) {
    const status = document.getElementById("ticketStatus");
    if (status) {
      status.textContent = message;
    }
  }

  function goToTicketIntake() {
    const panel = document.getElementById("ticketIntelligencePanel");
    scrollToElement(panel);
  }

  function goToGeneratedRunbook() {
    const output = document.getElementById("runbookOutput");
    const card = output ? output.closest(".ticket-card") : findCardByTitle("Generated Runbook");

    if (!scrollToElement(card)) {
      goToTicketIntake();
      showStatus("Analyze a ticket first to generate the runbook.");
    }
  }

  function goToChecklist() {
    const card = findCardByTitle("Smart Hands Checklist");

    if (!scrollToElement(card)) {
      goToTicketIntake();
      showStatus("Analyze a ticket first to generate the Smart Hands checklist.");
    }
  }

  function goToTicketSummary() {
    const output = document.getElementById("summaryOutput");
    const card = output ? output.closest(".ticket-card") : findCardByTitle("Ticket Summary");

    if (!scrollToElement(card)) {
      goToTicketIntake();
      showStatus("Analyze a ticket first to generate the ticket summary.");
    }
  }

  function goToClosureNotes() {
    const output = document.getElementById("closureOutput");
    const card = output ? output.closest(".ticket-card") : findCardByTitle("Closure Note");

    if (!scrollToElement(card)) {
      goToTicketIntake();
      showStatus("Analyze a ticket first to generate the closure note.");
    }
  }

  function goToHistory() {
    const viewReportsButton = document.getElementById("viewSavedReportsButton");

    if (viewReportsButton) {
      viewReportsButton.click();
      return;
    }

    const panel = document.getElementById("savedReportsPanel");
    if (!scrollToElement(panel)) {
      showStatus("Saved reports panel is not ready yet. Refresh the page and try again.");
    }
  }

  function wireSidebarNavigation() {
    document.querySelectorAll(".nav-button").forEach((button) => {
      const label = normalize(button.textContent);

      button.addEventListener("click", function (event) {
        if (
          label === "ticket intake" ||
          label === "generated runbook" ||
          label === "smart hands checklist" ||
          label === "ticket summary" ||
          label === "closure notes" ||
          label === "history"
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }

        if (label === "ticket intake") goToTicketIntake();
        if (label === "generated runbook") goToGeneratedRunbook();
        if (label === "smart hands checklist") goToChecklist();
        if (label === "ticket summary") goToTicketSummary();
        if (label === "closure notes") goToClosureNotes();
        if (label === "history") goToHistory();
      }, true);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireSidebarNavigation);
  } else {
    wireSidebarNavigation();
  }
})();
