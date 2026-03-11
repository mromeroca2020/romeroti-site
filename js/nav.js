(function () {
  // ============================================================
  // Romanoti Solutions - nav.js
  // Header global + selector de idioma + menús dinámicos
  // ============================================================
  //
  // ESTRUCTURA ASUMIDA Y USADA EN ESTE ARCHIVO
  // ------------------------------------------------------------
  // EN -> /en/
  // FR -> /fr/
  // ES -> /es/
  //
  // OBJETIVO DE ESTA VERSIÓN
  // ------------------------------------------------------------
  // 1) Mantener una sola fuente de verdad para las rutas.
  // 2) Evitar mezclar rutas viejas con la estructura actual.
  // 3) Corregir específicamente el menú de "Services / Servicios".
  // 4) Dejar el archivo documentado y fácil de mantener.
  //
  // NOTA IMPORTANTE
  // ------------------------------------------------------------
  // Esta corrección se enfoca en usar rutas coherentes con el
  // estado actual que describiste:
  // - /en/services/tools.html
  // - /fr/services/tools.html
  // - /es/services/tools.html
  // - /{lang}/services/cybersecurity.html
  //
  // Además, el menú de servicios queda alineado a páginas de
  // servicio consistentes:
  // - index.html
  // - help-desk.html
  // - networks-infrastructure.html
  // - cybersecurity.html
  // - tools.html
  //
  // Si más tarde confirmas el árbol exacto del proyecto, este
  // archivo será muy fácil de ajustar en ROUTES.
  // ============================================================

  if (window.__ROMANOTI_NAV_BOOTED__) {
    console.warn('[nav] Already booted. Skipping duplicate init.');
    return;
  }
  window.__ROMANOTI_NAV_BOOTED__ = true;

  console.log('[nav] booting...');

  // ============================================================
  // 1) DETECCIÓN DE IDIOMA SEGÚN LA URL ACTUAL
  // ------------------------------------------------------------
  // /en/... => en
  // /fr/... => fr
  // /es/... => es
  // Cualquier otro caso => en
  // ============================================================
  const path = window.location.pathname || '/';

  let lang = 'en';
  if (path === '/fr' || path.startsWith('/fr/')) {
    lang = 'fr';
  } else if (path === '/es' || path.startsWith('/es/')) {
    lang = 'es';
  } else if (path === '/en' || path.startsWith('/en/')) {
    lang = 'en';
  }

  // Prefijo base por idioma
  const base = lang === 'fr' ? '/fr' : lang === 'es' ? '/es' : '/en';

  // ============================================================
  // 2) TEXTOS POR IDIOMA
  // ------------------------------------------------------------
  // Aquí solo viven labels visibles.
  // Las rutas reales se controlan en ROUTES.
  // ============================================================
  const I18N_MAP = {
    es: {
      brand: 'Romanoti Solutions',
      home: 'Inicio',
      solutions: 'Soluciones',
      platform: 'Plataforma',
      tools: 'Herramientas',
      noc: 'NOC',
      soc: 'SOC',
      book: 'Agendar',
      overview: 'Resumen',
      mdr: 'CyberShield (MDR)',
      socConsole: 'Consola SOC',
      easm: 'Consola EASM',
      fieldKit: 'Field Kit (ingenieros)',
      quickAudit: 'Auditoría rápida',
      pov: 'POV 14 días',
      lang: 'Idioma',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      services: 'Servicios',
      servicesOverview: 'Resumen de servicios',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Redes e infraestructura',
      serviceCyber: 'Ciberseguridad',
      contact: 'Contacto',
      mobileCta: 'Soluciones'
    },
    en: {
      brand: 'Romanoti Solutions',
      home: 'Home',
      solutions: 'Solutions',
      platform: 'Platform',
      tools: 'Tools',
      noc: 'NOC',
      soc: 'SOC',
      book: 'Book Now',
      overview: 'Overview',
      mdr: 'CyberShield (MDR)',
      socConsole: 'SOC Console',
      easm: 'EASM Console',
      fieldKit: 'Field Kit (engineers)',
      quickAudit: 'Quick Audit',
      pov: '14-day POV',
      lang: 'Language',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      services: 'Services',
      servicesOverview: 'Services Overview',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Networks & Infrastructure',
      serviceCyber: 'Cybersecurity',
      contact: 'Contact',
      mobileCta: 'Solutions'
    },
    fr: {
      brand: 'Romanoti Solutions',
      home: 'Accueil',
      solutions: 'Solutions',
      platform: 'Plateforme',
      tools: 'Outils',
      noc: 'NOC',
      soc: 'SOC',
      book: 'Prendre RDV',
      overview: 'Aperçu',
      mdr: 'CyberShield (MDR)',
      socConsole: 'Console SOC',
      easm: 'Console EASM',
      fieldKit: 'Field Kit (ingénieurs)',
      quickAudit: 'Audit rapide',
      pov: 'POV 14 jours',
      lang: 'Langue',
      en: 'English',
      fr: 'Français',
      es: 'Español',
      services: 'Services',
      servicesOverview: 'Aperçu des services',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Réseaux et infrastructure',
      serviceCyber: 'Cybersécurité',
      contact: 'Contact',
      mobileCta: 'Solutions'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;

  // ============================================================
  // 3) RUTAS REALES CENTRALIZADAS
  // ------------------------------------------------------------
  // Aquí se define TODO lo que el nav necesita.
  // La ventaja es que si mañana cambias una página, cambias una vez.
  //
  // CORRECCIÓN CLAVE:
  // El dropdown de servicios YA NO usa:
  // - cloud-migration.html
  // - disaster-recovery.html
  // - it-noc.html
  // - it-soc.html
  //
  // Porque esas rutas son las que estaban desalineando el menú.
  // ============================================================
  const ROUTES = {
    en: {
      home: '/en/',
      contact: '/en/contact.html',
      booking: '/booking.html',
      platform: '/en/platform/index.html',
      dcMonitor: '/en/data-center/dashboard.html',
      tools: '/en/services/tools.html',
      noc: '/en/services/it-noc.html',
      soc: '/en/services/it-soc.html',
      services: [
        { key: 'servicesOverview', href: '/en/services/index.html' },
        { key: 'helpDesk', href: '/en/services/help-desk.html' },
        { key: 'networksInfra', href: '/en/services/networks-infrastructure.html' },
        { key: 'serviceCyber', href: '/en/services/cybersecurity.html' },
        { key: 'tools', href: '/en/services/tools.html' }
      ],
      solutions: [
        { key: 'overview', href: '/en/solutions/cybershield/index.html' },
        { key: 'mdr', href: '/en/solutions/cybershield/index.html' },
        { key: 'socConsole', href: '/en/solutions/cybershield/soc-console.html' },
        { key: 'easm', href: '/en/solutions/cybershield/easm-console.html' },
        { key: 'fieldKit', href: '/en/solutions/cybershield/field-kit.html' },
        { divider: true },
        { key: 'quickAudit', href: '/en/solutions/cybershield/quick-audit.html' },
        { key: 'pov', href: '/en/solutions/cybershield/pov-14d.html' }
      ]
    },
    fr: {
      home: '/fr/',
      contact: '/fr/contact.html',
      booking: '/booking.html',
      platform: '/fr/platform/index.html',
      dcMonitor: '/fr/data-center/dashboard.html',
      tools: '/fr/services/tools.html',
      noc: '/fr/services/it-noc.html',
      soc: '/fr/services/it-soc.html',
      services: [
        { key: 'servicesOverview', href: '/fr/services/index.html' },
        { key: 'helpDesk', href: '/fr/services/help-desk.html' },
        { key: 'networksInfra', href: '/fr/services/networks-infrastructure.html' },
        { key: 'serviceCyber', href: '/fr/services/cybersecurity.html' },
        { key: 'tools', href: '/fr/services/tools.html' }
      ],
      solutions: [
        { key: 'overview', href: '/fr/solutions/cybershield/index.html' },
        { key: 'mdr', href: '/fr/solutions/cybershield/index.html' },
        { key: 'socConsole', href: '/fr/solutions/cybershield/soc-console.html' },
        { key: 'easm', href: '/fr/solutions/cybershield/easm-console.html' },
        { key: 'fieldKit', href: '/fr/solutions/cybershield/field-kit.html' },
        { divider: true },
        { key: 'quickAudit', href: '/fr/solutions/cybershield/quick-audit.html' },
        { key: 'pov', href: '/fr/solutions/cybershield/pov-14d.html' }
      ]
    },
    es: {
      home: '/es/',
      contact: '/es/contact.html',
      booking: '/booking.html',
      platform: '/es/platform/index.html',
      dcMonitor: '/es/data-center/dashboard.html',
      tools: '/es/services/tools.html',
      noc: '/es/services/it-noc.html',
      soc: '/es/services/it-soc.html',
      services: [
        { key: 'servicesOverview', href: '/es/services/index.html' },
        { key: 'helpDesk', href: '/es/services/help-desk.html' },
        { key: 'networksInfra', href: '/es/services/networks-infrastructure.html' },
        { key: 'serviceCyber', href: '/es/services/cybersecurity.html' },
        { key: 'tools', href: '/es/services/tools.html' }
      ],
      solutions: [
        { key: 'overview', href: '/es/solutions/cybershield/index.html' },
        { key: 'mdr', href: '/es/solutions/cybershield/index.html' },
        { key: 'socConsole', href: '/es/solutions/cybershield/soc-console.html' },
        { key: 'easm', href: '/es/solutions/cybershield/easm-console.html' },
        { key: 'fieldKit', href: '/es/solutions/cybershield/field-kit.html' },
        { divider: true },
        { key: 'quickAudit', href: '/es/solutions/cybershield/quick-audit.html' },
        { key: 'pov', href: '/es/solutions/cybershield/pov-14d.html' }
      ]
    }
  };

  const CURRENT_ROUTES = ROUTES[lang] || ROUTES.en;

  // ============================================================
  // 4) HELPERS PARA CONSTRUIR MENÚS
  // ============================================================
  function buildDropdownLinks(items) {
    return items.map(item => {
      if (item.divider) {
        return '<div class="border-t my-1"></div>';
      }

      const label = I18N[item.key] || item.key;
      return `
        <a href="${item.href}"
           class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
           role="menuitem">
          ${label}
        </a>
      `;
    }).join('');
  }

  const servicesMenuHtml = buildDropdownLinks(CURRENT_ROUTES.services);
  const solutionsMenuHtml = buildDropdownLinks(CURRENT_ROUTES.solutions);

  // ============================================================
  // 5) HTML DEL HEADER
  // ------------------------------------------------------------
  // Todo se renderiza dinámicamente una sola vez.
  // ============================================================
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100" id="navHeader">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="${CURRENT_ROUTES.home}" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          ${I18N.brand}
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="${CURRENT_ROUTES.home}" class="text-gray-700 hover:text-blue-600">${I18N.home}</a>

          <div class="relative" id="navServicesRoot">
            <button id="navServicesBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="navServicesMenu">
              ${I18N.services}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div id="navServicesMenu"
                 class="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-2 hidden z-40"
                 role="menu"
                 aria-labelledby="navServicesBtn">
              ${servicesMenuHtml}
            </div>
          </div>

          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="navSolutionsMenu">
              ${I18N.solutions}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div id="navSolutionsMenu"
                 class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden z-40"
                 role="menu"
                 aria-labelledby="navSolutionsBtn">
              ${solutionsMenuHtml}
            </div>
          </div>

          <a href="${CURRENT_ROUTES.platform}" class="text-gray-700 hover:text-blue-600">${I18N.platform}</a>
          <a href="${CURRENT_ROUTES.tools}" class="text-gray-700 hover:text-blue-600">${I18N.tools}</a>
          <a href="${CURRENT_ROUTES.noc}" class="text-gray-700 hover:text-blue-600">${I18N.noc}</a>
          <a href="${CURRENT_ROUTES.dcMonitor}" class="text-gray-700 hover:text-blue-600">DC Monitor</a>
          <a href="${CURRENT_ROUTES.soc}" class="text-gray-700 hover:text-blue-600">${I18N.soc}</a>
          <a href="${CURRENT_ROUTES.contact}" class="text-gray-700 hover:text-blue-600">${I18N.contact}</a>

          <a href="${CURRENT_ROUTES.booking}" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">${I18N.book}</a>

          <div class="relative" id="langRoot">
            <button id="langBtn"
                    class="text-gray-500 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="langMenu">
              🌐 ${I18N.lang}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div id="langMenu" class="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden z-40">
              <a href="#" data-lang="en" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇬🇧 ${I18N_MAP.en.en}</a>
              <a href="#" data-lang="fr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇫🇷 ${I18N_MAP.fr.fr}</a>
              <a href="#" data-lang="es" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇪🇸 ${I18N_MAP.es.es}</a>
            </div>
          </div>
        </nav>

        <div class="md:hidden">
          <a href="${CURRENT_ROUTES.solutions[0].href}" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.mobileCta}</a>
        </div>
      </div>
    </div>
  </header>`;

  // ============================================================
  // 6) MONTAJE DEL HEADER
  // ------------------------------------------------------------
  // Si existe #app-header, lo usamos.
  // Si no existe, insertamos el header al principio del body.
  // ============================================================
  function mountHeader() {
    if (document.documentElement.getAttribute('data-nav-mounted') === '1') {
      console.warn('[nav] Header already mounted, skipping mount.');
      window.ROMANOTI_NAV_READY = true;
      return;
    }

    const mountPoint = document.getElementById('app-header');

    if (mountPoint) {
      mountPoint.innerHTML = html;
    } else {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }

    document.documentElement.setAttribute('data-nav-mounted', '1');
    window.ROMANOTI_NAV_READY = true;
  }

  // ============================================================
  // 7) LIMPIEZA DE RUTA AL CAMBIAR DE IDIOMA
  // ------------------------------------------------------------
  // Ejemplos:
  // /es/services/tools.html  -> /services/tools.html
  // /fr/platform/index.html  -> /platform/
  // ============================================================
  function cleanPath(pathname) {
    if (!pathname) return '/';

    let out = pathname.replace(/^\/(en|fr|es)(?=\/|$)/, '');

    if (!out) out = '/';

    out = out.replace(/\/{2,}/g, '/');
    out = out.replace(/\/index\.html$/i, '/');

    return out;
  }

  // ============================================================
  // 8) CAMBIO DE IDIOMA
  // ------------------------------------------------------------
  // Intenta mantener la misma ruta en otro idioma.
  // Si la página equivalente no existe, vuelve al home del idioma.
  // ============================================================
  async function goToLanguage(targetLang) {
    try {
      localStorage.setItem('lang', targetLang);
    } catch (e) {
      // No pasa nada si localStorage falla.
    }

    const currentPath = cleanPath(window.location.pathname);

    let prefix = '/en';
    let fallback = '/en/';

    if (targetLang === 'fr') {
      prefix = '/fr';
      fallback = '/fr/';
    } else if (targetLang === 'es') {
      prefix = '/es';
      fallback = '/es/';
    }

    const target = prefix + (currentPath.startsWith('/') ? currentPath : `/${currentPath}`);

    try {
      const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });
      if (res.ok) {
        window.location.href = target + window.location.search + window.location.hash;
      } else {
        window.location.href = fallback;
      }
    } catch (err) {
      window.location.href = fallback;
    }
  }

  // ============================================================
  // 9) INTERACCIÓN DE MENÚS
  // ------------------------------------------------------------
  // Se cablean:
  // - dropdown de Solutions
  // - dropdown de Services
  // - selector de idioma
  // ============================================================
  function wireMenus() {
    // -------------------------------
    // Solutions dropdown
    // -------------------------------
    const solutionsBtn = document.getElementById('navSolutionsBtn');
    const solutionsMenu = document.getElementById('navSolutionsMenu');
    const solutionsRoot = document.getElementById('navSolutionsRoot');

    if (solutionsBtn && solutionsMenu && !solutionsBtn.dataset.wired) {
      const open = () => {
        solutionsMenu.classList.remove('hidden');
        solutionsBtn.setAttribute('aria-expanded', 'true');
      };

      const close = () => {
        solutionsMenu.classList.add('hidden');
        solutionsBtn.setAttribute('aria-expanded', 'false');
      };

      const toggle = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        solutionsMenu.classList.contains('hidden') ? open() : close();
      };

      solutionsBtn.addEventListener('click', toggle);
      solutionsBtn.addEventListener('mouseenter', open);

      if (solutionsRoot) {
        solutionsRoot.addEventListener('mouseleave', () => setTimeout(close, 120));
        solutionsRoot.style.overflow = 'visible';
      }

      document.addEventListener('click', (e) => {
        if (!solutionsMenu.contains(e.target) && e.target !== solutionsBtn) {
          close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      solutionsBtn.dataset.wired = '1';
    }

    // -------------------------------
    // Services dropdown
    // -------------------------------
    const servicesBtn = document.getElementById('navServicesBtn');
    const servicesMenu = document.getElementById('navServicesMenu');
    const servicesRoot = document.getElementById('navServicesRoot');

    if (servicesBtn && servicesMenu && servicesRoot && !servicesBtn.dataset.wired) {
      let closeTimer = null;

      const open = () => {
        clearTimeout(closeTimer);
        servicesMenu.classList.remove('hidden');
        servicesBtn.setAttribute('aria-expanded', 'true');
      };

      const close = () => {
        servicesMenu.classList.add('hidden');
        servicesBtn.setAttribute('aria-expanded', 'false');
      };

      const scheduleClose = () => {
        closeTimer = setTimeout(close, 250);
      };

      servicesBtn.addEventListener('mouseenter', open);
      servicesMenu.addEventListener('mouseenter', () => clearTimeout(closeTimer));

      servicesBtn.addEventListener('mouseleave', scheduleClose);
      servicesMenu.addEventListener('mouseleave', scheduleClose);

      servicesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        servicesMenu.classList.contains('hidden') ? open() : close();
      });

      document.addEventListener('click', (e) => {
        if (!servicesRoot.contains(e.target)) close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      servicesRoot.style.overflow = 'visible';
      servicesBtn.dataset.wired = '1';
    }

    // -------------------------------
    // Language dropdown
    // -------------------------------
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');

    if (langBtn && langMenu && !langBtn.dataset.wired) {
      const close = () => langMenu.classList.add('hidden');

      langBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        langMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!langMenu.contains(e.target) && e.target !== langBtn) close();
      });

      langMenu.querySelectorAll('a[data-lang]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLang = link.dataset.lang || 'en';
          goToLanguage(targetLang);
        });
      });

      langBtn.dataset.wired = '1';
    }
  }

  // ============================================================
  // 10) BOOT GENERAL
  // ============================================================
  function boot() {
    mountHeader();
    wireMenus();
    console.log('[nav] mounted & wired');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
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
