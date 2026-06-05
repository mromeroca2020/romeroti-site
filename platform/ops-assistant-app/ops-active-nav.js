(function () {
  function normalize(text) {
    return String(text || "").trim().toLowerCase();
  }

  function ensureActiveStyle() {
    if (document.getElementById("opsActiveNavStyles")) return;

    const style = document.createElement("style");
    style.id = "opsActiveNavStyles";
    style.textContent = `
      .nav-button.romanoti-active,
      .nav-button.active.romanoti-active {
        background: linear-gradient(135deg, rgba(139,92,246,.34), rgba(245,158,11,.24)) !important;
        border-color: rgba(139,92,246,.75) !important;
        color: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(139,92,246,.16), 0 12px 28px rgba(0,0,0,.22) !important;
      }

      .nav-button.romanoti-active::before {
        content: "● ";
        color: #f59e0b;
      }
    `;
    document.head.appendChild(style);
  }

  function setActiveButton(button) {
    if (!button) return;

    document.querySelectorAll(".nav-button").forEach((item) => {
      item.classList.remove("active");
      item.classList.remove("romanoti-active");
    });

    button.classList.add("active");
    button.classList.add("romanoti-active");
  }

  function activateByLabel(labelText) {
    const expected = normalize(labelText);

    document.querySelectorAll(".nav-button").forEach((button) => {
      const match = normalize(button.textContent.replace("●", "")) === expected;
      button.classList.toggle("active", match);
      button.classList.toggle("romanoti-active", match);
    });
  }

  function initActiveNav() {
    ensureActiveStyle();

    document.addEventListener("click", function (event) {
      const button = event.target.closest(".nav-button");
      if (!button) return;

      setActiveButton(button);
    }, true);

    activateByLabel("Ticket Intake");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initActiveNav);
  } else {
    initActiveNav();
  }
})();
