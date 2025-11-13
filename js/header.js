/* ==========================================
   HEADER.JS — RomanoTI Solutions (Multi-Language)
   Carga dinámica del HEADER para ES / EN / FR
   ========================================== */

(function () {

  /* Detectar idioma según URL */
  function detectLang() {
    const path = window.location.pathname;

    if (path === "/" || path.startsWith("/es") || path.startsWith("/index")) return "es";
    if (path.startsWith("/en")) return "en";
    if (path.startsWith("/fr")) return "fr";

    return "es"; // fallback
  }

  const lang = detectLang();

  /* ============================
     TEXTOS DEL MENÚ POR IDIOMA
     ============================ */
  const i18n = {
    es: {
      home: "Inicio",
      solutions: "Soluciones",
      services: "Servicios",
      contact: "Contacto",
      submenu_cyber: "Ciberseguridad",
      submenu_dc: "DataCenter",
      submenu_noc: "Centro de Operaciones NOC",
      submenu_soc: "Centro de Operaciones SOC"
    },
    en: {
      home: "Home",
      solutions: "Solutions",
      services: "Services",
      contact: "Contact",
      submenu_cyber: "CyberShield",
      submenu_dc: "DataCenter",
      submenu_noc: "NOC Operations",
      submenu_soc: "SOC Operations"
    },
    fr: {
      home: "Accueil",
      solutions: "Solutions",
      services: "Services",
      contact: "Contact",
      submenu_cyber: "CyberSécurité",
      submenu_dc: "Centre de Données",
      submenu_noc: "Centre d’Opérations NOC",
      submenu_soc: "Centre d’Opérations SOC"
    }
  };

  const t = i18n[lang];

  /* ========================
     RUTAS DINÁMICAS POR IDIOMA
     ======================== */
  const base = "/" + lang;

  const routes = {
    home: `${base}/index.html`,
    solutions: `${base}/solutions/index.html`,
    cyber: `${base}/solutions/cybershield/index.html`,
    datacenter: `${base}/services/datacenter.html`,
    noc: `${base}/it-noc.html`,
    soc: `${base}/it-soc.html`,
    contact: `${base}/company.html`
  };

  /* ==========================
     HTML DEL HEADER DINÁMICO
     ========================== */
  const html = `
  <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">

      <!-- LOGO -->
      <a href="${routes.home}" class="flex items-center gap-2">
        <img src="/img/logo-romanoti.png" alt="Romanoti Solutions" class="h-10">
      </a>

      <!-- MENU DESKTOP -->
      <nav class="hidden md:flex items-center gap-8 text-gray-700 font-medium">

        <a href="${routes.home}" class="hover:text-blue-600">${t.home}</a>

        <!-- Solutions con submenu -->
        <div class="group relative">
          <button class="hover:text-blue-600 flex items-center gap-1">
            ${t.solutions}
            <span>▼</span>
          </button>

          <div class="absolute hidden group-hover:block bg-white shadow-lg border rounded-md py-2 w-56 z-50">
            <a href="${routes.cyber}" class="block px-4 py-2 hover:bg-gray-100">${t.submenu_cyber}</a>
            <a href="${routes.datacenter}" class="block px-4 py-2 hover:bg-gray-100">${t.submenu_dc}</a>
            <a href="${routes.noc}" class="block px-4 py-2 hover:bg-gray-100">${t.submenu_noc}</a>
            <a href="${routes.soc}" class="block px-4 py-2 hover:bg-gray-100">${t.submenu_soc}</a>
          </div>
        </div>

        <a href="${routes.services}" class="hover:text-blue-600">${t.services}</a>
        <a href="${routes.contact}" class="hover:text-blue-600">${t.contact}</a>
      </nav>

      <!-- BOTÓN MOBILE -->
      <button id="mobileMenuBtn" class="md:hidden text-2xl">☰</button>
    </div>

    <!-- MENU MOBILE -->
    <div id="mobileMenu" class="hidden bg-white border-t border-gray-200 md:hidden">
      <nav class="flex flex-col p-4 text-gray-700 font-medium gap-3">
        <a href="${routes.home}">${t.home}</a>

        <details>
          <summary class="cursor-pointer">${t.solutions}</summary>
          <div class="ml-4 mt-2 flex flex-col gap-2">
            <a href="${routes.cyber}">${t.submenu_cyber}</a>
            <a href="${routes.datacenter}">${t.submenu_dc}</a>
            <a href="${routes.noc}">${t.submenu_noc}</a>
            <a href="${routes.soc}">${t.submenu_soc}</a>
          </div>
        </details>

        <a href="${routes.services}">${t.services}</a>
        <a href="${routes.contact}">${t.contact}</a>
      </nav>
    </div>
  </header>
  `;

  /* ============================
     MONTAR HEADER EN EL DOM
     ============================ */
  function mountHeader() {
    let mount = document.getElementById("app-header");

    if (!mount) {
      mount = document.createElement("div");
      mount.id = "app-header";
      document.body.prepend(mount);
    }

    mount.innerHTML = html;

    // Toggle menú mobile
    const btn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (btn && mobileMenu) {
      btn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    console.log("[header.js] Header loaded for:", lang.toUpperCase());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHeader);
  } else {
    mountHeader();
  }

})();
