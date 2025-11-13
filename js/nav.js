(function () {
  // ============================================================
  // RomanoTI nav.js — Header global + selector de idioma + menús
  // ============================================================
  // FUNCIONES CLAVE:
  // 1) Detecta el idioma según la ruta actual:
  //      /es/...  -> lang = 'es'
  //      /en/...  -> lang = 'en'
  //      /fr/...  -> lang = 'fr'
  //      "/"      -> se toma como ES por defecto
  //
  // 2) Construye un prefijo base para los enlaces:
  //      base = '/es' | '/en' | '/fr'
  //
  // 3) Inserta un header único para todos los idiomas
  //
  // 4) Menús desplegables:
  //      - Services
  //      - Solutions
  //    Se abren/cerran SOLO con click (sin hover ni mouseleave)
  //    y se cierran al hacer click fuera o al pulsar ESC.
  //
  // 5) Selector de idioma:
  //    - Intenta ir a la misma ruta en el idioma elegido
  //      (ej: /es/solutions/... -> /en/solutions/...)
  //    - Si la ruta no existe, hace fallback al home de ese idioma.
  // ============================================================

  console.log("[nav] booting…");

  // 1) Detección de idioma por ruta
  const path = window.location.pathname || "/";

  // "/" lo tratamos como ES por defecto
  const lang =
    path === "/" || path.startsWith("/es/") || path === "/es"
      ? "es"
      : path.startsWith("/en/") || path === "/en"
      ? "en"
      : path.startsWith("/fr/") || path === "/fr"
      ? "fr"
      : "es";

  // Prefijo base para todas las rutas del menú
  // -> siempre forzamos a ir a /es, /en o /fr
  const base = lang === "en" ? "/en" : lang === "fr" ? "/fr" : "/es";

  // 2) Textos por idioma
  const I18N_MAP = {
    es: {
      brand: "RomanoTI Solutions",
      home: "Inicio",
      solutions: "Soluciones",
      tools: "Herramientas",
      noc: "NOC",
      soc: "SOC",
      book: "Agendar",
      // Solutions
      overview: "Resumen",
      mdr: "CyberShield (MDR)",
      socConsole: "Consola SOC",
      easm: "Consola EASM",
      fieldKit: "Field Kit (ingenieros)",
      quickAudit: "Auditoría rápida",
      pov: "POV 14 días",
      // Idioma
      lang: "Idioma",
      en: "English",
      fr: "Français",
      es: "Español",
      // Services
      services: "Servicios",
      serviceCloud: "Cloud Migration",
      serviceInfra: "Infraestructura TI",
      serviceCyber: "Ciberseguridad",
      serviceDC: "Data Center & Virtualización",
      serviceDR: "Backups y DRP",
      serviceNOC: "Servicios NOC",
    },
    en: {
      brand: "RomanoTI Solutions",
      home: "Home",
      solutions: "Solutions",
      tools: "Tools",
      noc: "NOC",
      soc: "SOC",
      book: "Book Now",
      overview: "Overview",
      mdr: "CyberShield (MDR)",
      socConsole: "SOC Console",
      easm: "EASM Console",
      fieldKit: "Field Kit (engineers)",
      quickAudit: "Quick Audit",
      pov: "14-day POV",
      lang: "Language",
      en: "English",
      fr: "Français",
      es: "Español",
      services: "Services",
      serviceCloud: "Cloud Migration",
      serviceInfra: "IT Infrastructure",
      serviceCyber: "Cybersecurity",
      serviceDC: "Data Center & Virtualization",
      serviceDR: "Backups & Disaster Recovery",
      serviceNOC: "NOC Services",
    },
    fr: {
      brand: "RomanoTI Solutions",
      home: "Accueil",
      solutions: "Solutions",
      tools: "Outils",
      noc: "NOC",
      soc: "SOC",
      book: "Prendre RDV",
      overview: "Aperçu",
      mdr: "CyberShield (MDR)",
      socConsole: "Console SOC",
      easm: "Console EASM",
      fieldKit: "Field Kit (ingénieurs)",
      quickAudit: "Audit rapide",
      pov: "POV 14 jours",
      lang: "Langue",
      en: "English",
      fr: "Français",
      es: "Español",
      services: "Services",
      serviceCloud: "Migration vers le cloud",
      serviceInfra: "Infrastructure TI",
      serviceCyber: "Cybersécurité",
      serviceDC: "Centre de données & Virtualisation",
      serviceDR: "Sauvegardes & PRA",
      serviceNOC: "Services NOC",
    },
  };

  const I18N = I18N_MAP[lang];

  // 3) HTML del header global
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100" id="navHeader">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="${base}/" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          ${I18N.brand}
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="${base}/" class="text-gray-700 hover:text-blue-600">${I18N.home}</a>

          <!-- Dropdown Services -->
          <div class="relative" id="navServicesRoot">
            <button id="navServicesBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navServicesMenu">
              ${I18N.services}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div id="navServicesMenu"
                 class="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-2 hidden z-40"
                 role="menu" aria-labelledby="navServicesBtn">
              <a href="${base}/services/cloud-migration.html"    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceCloud}</a>
              <a href="${base}/services/it-infrastructure.html"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceInfra}</a>
              <a href="${base}/services/cybersecurity.html"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceCyber}</a>
              <a href="${base}/services/data-center.html"        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceDC}</a>
              <a href="${base}/services/disaster-recovery.html"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceDR}</a>
              <a href="${base}/services/noc.html"                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceNOC}</a>
            </div>
          </div>

          <!-- Dropdown Solutions -->
          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navSolutionsMenu">
              ${I18N.solutions}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div id="navSolutionsMenu"
                 class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden"
                 role="menu" aria-labelledby="navSolutionsBtn">
              <a href="${base}/solutions/"                              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.overview}</a>
              <a href="${base}/solutions/cybershield/"                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.mdr}</a>
              <a href="${base}/solutions/cybershield/soc-console.html"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.socConsole}</a>
              <a href="${base}/solutions/cybershield/easm-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.easm}</a>
              <a href="${base}/solutions/cybershield/field-kit.html"    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.fieldKit}</a>
              <div class="border-t my-1"></div>
              <a href="${base}/solutions/cybershield/quick-audit.html"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.quickAudit}</a>
              <a href="${base}/solutions/cybershield/pov-14d.html"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.pov}</a>
            </div>
          </div>

          <a href="${base}/services/tools.html" class="text-gray-700 hover:text-blue-600">${I18N.tools}</a>
          <a href="${base}/it-noc.html"         class="text-gray-700 hover:text-blue-600">${I18N.noc}</a>
          <a href="${base}/it-soc.html"         class="text-gray-700 hover:text-blue-600">${I18N.soc}</a>
          <a href="https://calendly.com/mauricioromeroca" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">${I18N.book}</a>

          <!-- Selector de idioma -->
          <div class="relative" id="langRoot">
            <button id="langBtn" class="text-gray-500 hover:text-blue-600 inline-flex items-center" aria-haspopup="true" aria-expanded="false">
              🌐 ${I18N.lang}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div id="langMenu" class="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden">
              <a href="#" data-lang="en" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇬🇧 ${I18N_MAP.en.en}</a>
              <a href="#" data-lang="fr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇫🇷 ${I18N_MAP.fr.fr}</a>
              <a href="#" data-lang="es" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇪🇸 ${I18N_MAP.es.es}</a>
            </div>
          </div>
        </nav>

        <!-- Vista móvil: botón directo a Solutions -->
        <div class="md:hidden">
          <a href="${base}/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.solutions}</a>
        </div>
      </div>
    </div>
  </header>`;

  // 4) Montaje del header (usa #app-header si existe, si no lo inserta al inicio del body)
  function mountHeader() {
    const mount = document.getElementById("app-header");
    if (mount) {
      mount.innerHTML = html;
    } else {
      const temp = document.createElement("div");
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }
    document.documentElement.setAttribute("data-nav-mounted", "1");
    window.ROMANOTI_NAV_READY = true;
  }

  // ---- Helpers para cambio de idioma ----
  function cleanPath(p) {
    if (!p) return "/";
    // quita el prefijo /en, /fr, /es
    let out = p.replace(/^\/(en|fr|es)(?=\/|$)/, "");
    if (!out) out = "/";
    out = out.replace(/\/{2,}/g, "/");
    out = out.replace(/\/index\.html$/i, "/");
    return out;
  }

  async function goToLanguage(targetLang) {
    const prefix = targetLang === "en" ? "/en" : targetLang === "fr" ? "/fr" : "/es";
    const current = cleanPath(window.location.pathname);
    const target = prefix + (current.startsWith("/") ? current : "/" + current);
    const fallback = prefix + "/";

    try {
      const res = await fetch(target, { method: "HEAD" });
      if (res.ok) {
        window.location.href = target + window.location.search + window.location.hash;
      } else {
        window.location.href = fallback;
      }
    } catch (_) {
      window.location.href = fallback;
    }
  }

  // 5) Cableado de menús (Services + Solutions + Idioma)
  function wireMenus() {
    // Helper genérico para dropdowns
    function setupDropdown(btnId, menuId) {
      const btn = document.getElementById(btnId);
      const menu = document.getElementById(menuId);

      if (!btn || !menu || btn.dataset.wired) return;

      const open = () => {
        menu.classList.remove("hidden");
        btn.setAttribute("aria-expanded", "true");
      };

      const close = () => {
        menu.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
      };

      const toggle = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (menu.classList.contains("hidden")) open();
        else close();
      };

      // Solo click para abrir/cerrar
      btn.addEventListener("click", toggle);

      // Cerrar al hacer click fuera
      document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== btn) {
          close();
        }
      });

      // Cerrar con ESC
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });

      btn.dataset.wired = "1";
    }

    // Menú Services
    setupDropdown("navServicesBtn", "navServicesMenu");
    // Menú Solutions
    setupDropdown("navSolutionsBtn", "navSolutionsMenu");

    // Selector de idioma
    const langBtn = document.getElementById("langBtn");
    const langMenu = document.getElementById("langMenu");

    if (langBtn && langMenu && !langBtn.dataset.wired) {
      const close = () => langMenu.classList.add("hidden");

      langBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        langMenu.classList.toggle("hidden");
      });

      document.addEventListener("click", (e) => {
        if (!langMenu.contains(e.target) && e.target !== langBtn) close();
      });

      langMenu.querySelectorAll("a[data-lang]").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const targetLang = a.dataset.lang || "es";
          goToLanguage(targetLang);
        });
      });

      langBtn.dataset.wired = "1";
    }
  }

  // 6) Boot
  function boot() {
    mountHeader();
    wireMenus();
    console.log("[nav] mounted & wired (lang:", lang, ", base:", base, ")");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      boot();
      setTimeout(wireMenus, 200);
      setTimeout(wireMenus, 800);
    });
  } else {
    boot();
    setTimeout(wireMenus, 200);
    setTimeout(wireMenus, 800);
  }
})();
