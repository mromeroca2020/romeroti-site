/* ================================
   NAV.JS – RomanoTI Solutions v9
   Multi-language ES / EN / FR
   ================================ */

(function () {

  /* -----------------------------
     Detect Language by URL
  ----------------------------- */
  function detectLang() {
    const path = window.location.pathname;

    if (path === "/" || path.startsWith("/es") || path.startsWith("/index")) {
      return "es";
    }
    if (path.startsWith("/en")) {
      return "en";
    }
    if (path.startsWith("/fr")) {
      return "fr";
    }
    return "es";
  }

  const lang = detectLang();


  /* -----------------------------
     Solutions Menu Routes
  ----------------------------- */
  const SOL = {
    es: {
      cloud: "/solutions/cloud-migration/",
      infra: "/solutions/infrastructure/",
      cyber: "/solutions/cybershield/",
      datacenter: "/solutions/datacenter/",
      backup: "/solutions/backups/",
      noc: "/solutions/noc/"
    },
    en: {
      cloud: "/en/solutions/cloud-migration/",
      infra: "/en/solutions/infrastructure/",
      cyber: "/en/solutions/cybershield/",
      datacenter: "/en/solutions/datacenter/",
      backup: "/en/solutions/backups/",
      noc: "/en/solutions/noc/"
    },
    fr: {
      cloud: "/fr/solutions/cloud-migration/",
      infra: "/fr/solutions/infrastructure/",
      cyber: "/fr/solutions/cybershield/",
      datacenter: "/fr/solutions/datacenter/",
      backup: "/fr/solutions/backups/",
      noc: "/fr/solutions/noc/"
    }
  };

  const L = SOL[lang];


  /* -----------------------------
     Build Solutions Menu HTML
  ----------------------------- */
  function buildSolutionsMenu() {

    return `
      <div id="solutionsMenu" 
           class="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 hidden"
           data-nav="solutions-menu">

        <ul class="py-2 text-gray-800">
          <li><a id="nav-cloud" href="${L.cloud}" class="block px-4 py-2 hover:bg-gray-100">Cloud Migration</a></li>
          <li><a id="nav-infra" href="${L.infra}" class="block px-4 py-2 hover:bg-gray-100">Infrastructure</a></li>
          <li><a id="nav-cyber" href="${L.cyber}" class="block px-4 py-2 hover:bg-gray-100">Cybersecurity (MDR)</a></li>
          <li><a id="nav-dc" href="${L.datacenter}" class="block px-4 py-2 hover:bg-gray-100">Datacenter</a></li>
          <li><a id="nav-backup" href="${L.backup}" class="block px-4 py-2 hover:bg-gray-100">Backups</a></li>
          <li><a id="nav-noc" href="${L.noc}" class="block px-4 py-2 hover:bg-gray-100">NOC</a></li>
        </ul>
      </div>
    `;
  }


  /* -----------------------------
     Inject menu under button
  ----------------------------- */
  function injectMenu(btn) {
    if (!btn) return;

    // Avoid injecting twice
    if (document.querySelector("[data-nav='solutions-menu']")) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = buildSolutionsMenu();
    btn.parentNode.appendChild(wrapper.firstElementChild);
  }


  /* -----------------------------
     Menu open/close behavior
  ----------------------------- */
  function wireMenu(btn, menu) {
    if (!btn || !menu) return;

    let closeTimeout = null;

    function open() {
      clearTimeout(closeTimeout);
      menu.classList.remove("hidden");
    }

    function close() {
      menu.classList.add("hidden");
    }

    // Desktop hover
    btn.addEventListener("mouseenter", open);
    menu.addEventListener("mouseenter", open);
    btn.addEventListener("mouseleave", () => closeTimeout = setTimeout(close, 120));
    menu.addEventListener("mouseleave", () => closeTimeout = setTimeout(close, 120));

    // Mobile tap
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.contains("hidden") ? open() : close();
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== btn) close();
    });

  }


  /* -----------------------------
     Boot on load
  ----------------------------- */
  function bootMenu() {
    const btn = document.querySelector("[data-nav='solutions-btn']");
    if (!btn) return;

    injectMenu(btn);

    // Need small delay so menu exists
    setTimeout(() => {
      const menu = document.querySelector("[data-nav='solutions-menu']");
      wireMenu(btn, menu);
    }, 60);
  }

  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(bootMenu, 150);
    setTimeout(bootMenu, 500);
    setTimeout(bootMenu, 1200);
  });

})();
