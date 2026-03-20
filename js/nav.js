(function () {
  // ============================================================
  // Romanoti Solutions - Global nav.js
  // ============================================================
  //
  // OBJETIVO
  // ------------------------------------------------------------
  // Header global estable, multilenguaje y alineado al árbol real.
  //
  // REGLAS DE ESTA VERSIÓN
  // ------------------------------------------------------------
  // 1) Usar SOLO rutas confirmadas del proyecto actual.
  // 2) No inventar páginas no verificadas.
  // 3) Mantener compatibilidad con:
  //    - GitHub
  //    - Netlify
  //    - Render
  //    - frontend estático por idioma
  //
  // ESTRUCTURA DE IDIOMA
  // ------------------------------------------------------------
  // EN -> /en/
  // FR -> /fr/
  // ES -> /es/
  //
  // CHANGE #82
  // ------------------------------------------------------------
  // Se actualizan las rutas del menú para alinearlas con la
  // estructura real actual del repositorio:
  //
  // services/helpdesk.html
  // services/networks.html
  // services/cybersecurity.html
  // solutions/index.html
  // enterprise/government-business.html
  // why-romanoti.html
  //
  // Se conserva la estructura completa del nav existente
  // para no romper dropdowns, idioma, wiring ni responsive.
  //
  // CHANGE #84
  // ------------------------------------------------------------
  // Se corrige la imagen del logo del header:
  // ANTES: /images/romanoti-logo-transparent.png
  // AHORA: /images/logo.png
  //
  // Motivo:
  // - El PNG transparente sí existe, pero visualmente se está
  //   mostrando demasiado pequeño en producción por su recorte.
  // - /images/logo.png es más adecuado para el header.
  //
  // Además:
  // - Se agrega fallback automático a /images/romanoti-icon.png
  // - Se ajusta la altura visual del logo a h-10
  // ============================================================

  if (window.__ROMANOTI_NAV_BOOTED__) {
    console.warn('[nav] Already booted. Skipping duplicate init.');
    return;
  }
  window.__ROMANOTI_NAV_BOOTED__ = true;

  console.log('[nav] booting...');

  // ============================================================
  // 1) DETECCIÓN DE IDIOMA DESDE LA URL
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

  // ============================================================
  // 2) TEXTOS POR IDIOMA
  // ============================================================
  const I18N_MAP = {
    es: {
      brand: 'Romanoti Solutions',
      home: 'Inicio',
      services: 'Servicios',
      solutions: 'Soluciones',
      platform: 'Plataforma',
      enterprise: 'Enterprise',
      whyRomanoti: 'Por qué Romanoti',
      contact: 'Contacto',
      book: 'Agendar',
      lang: 'Idioma',

      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Redes e infraestructura',
      cybersecurity: 'Ciberseguridad',
      tools: 'Herramientas y diagnóstico',

      solutionsOverview: 'Resumen de soluciones',
      platformOverview: 'Resumen de plataforma',
      governmentBusiness: 'Government & Enterprise',

      en: 'English',
      fr: 'Français',
      es: 'Español',

      mobileCta: 'Soluciones'
    },
    en: {
      brand: 'Romanoti Solutions',
      home: 'Home',
      services: 'Services',
      solutions: 'Solutions',
      platform: 'Platform',
      enterprise: 'Enterprise',
      whyRomanoti: 'Why Romanoti',
      contact: 'Contact',
      book: 'Book Now',
      lang: 'Language',

      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Networks & Infrastructure',
      cybersecurity: 'Cybersecurity',
      tools: 'Tools & Diagnostics',

      solutionsOverview: 'Solutions Overview',
      platformOverview: 'Platform Overview',
      governmentBusiness: 'Government & Enterprise',

      en: 'English',
      fr: 'Français',
      es: 'Español',

      mobileCta: 'Solutions'
    },
    fr: {
      brand: 'Romanoti Solutions',
      home: 'Accueil',
      services: 'Services',
      solutions: 'Solutions',
      platform: 'Plateforme',
      enterprise: 'Entreprise',
      whyRomanoti: 'Pourquoi Romanoti',
      contact: 'Contact',
      book: 'Prendre RDV',
      lang: 'Langue',

      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Réseaux et infrastructure',
      cybersecurity: 'Cybersécurité',
      tools: 'Outils et diagnostic',

      solutionsOverview: 'Aperçu des solutions',
      platformOverview: 'Aperçu de la plateforme',
      governmentBusiness: 'Government & Enterprise',

      en: 'English',
      fr: 'Français',
      es: 'Español',

      mobileCta: 'Solutions'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;

  // ============================================================
  // 3) RUTAS REALES CONFIRMADAS
  // ------------------------------------------------------------
  // Nota:
  // Hoy el sitio ya tiene varias páginas en raíz sin versión /en /fr /es.
  // Para no romper navegación, se apuntan a las rutas reales existentes.
  // ============================================================
  const ROUTES = {
    en: {
      home: '/',
      platform: '/platform/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/solutions/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html',

      services: [
        { key: 'helpDesk', href: '/services/helpdesk.html' },
        { key: 'networksInfra', href: '/services/networks.html' },
        { key: 'cybersecurity', href: '/services/cybersecurity.html' },
        { key: 'tools', href: '/services/tools.html' }
      ],

      solutions: [
        { key: 'solutionsOverview', href: '/solutions/index.html' },
        { key: 'platformOverview', href: '/platform/index.html' },
        { key: 'governmentBusiness', href: '/enterprise/government-business.html' }
      ]
    },

    fr: {
      home: '/',
      platform: '/platform/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html',

      services: [
        { key: 'helpDesk', href: '/services/helpdesk.html' },
        { key: 'networksInfra', href: '/services/networks.html' },
        { key: 'cybersecurity', href: '/services/cybersecurity.html' },
        { key: 'tools', href: '/services/tools.html' }
      ],

      solutions: [
        { key: 'solutionsOverview', href: '/solutions/index.html' },
        { key: 'platformOverview', href: '/platform/index.html' },
        { key: 'governmentBusiness', href: '/enterprise/government-business.html' }
      ]
    },

    es: {
      home: '/',
      platform: '/platform/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html',

      services: [
        { key: 'helpDesk', href: '/services/helpdesk.html' },
        { key: 'networksInfra', href: '/services/networks.html' },
        { key: 'cybersecurity', href: '/services/cybersecurity.html' },
        { key: 'tools', href: '/services/tools.html' }
      ],

      solutions: [
        { key: 'solutionsOverview', href: '/solutions/index.html' },
        { key: 'platformOverview', href: '/platform/index.html' },
        { key: 'governmentBusiness', href: '/enterprise/government-business.html' }
      ]
    }
  };

  const CURRENT = ROUTES[lang] || ROUTES.en;

  // ============================================================
  // 4) HELPERS PARA DROPDOWNS
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

  const servicesMenuHtml = buildDropdownLinks(CURRENT.services);
  const solutionsMenuHtml = buildDropdownLinks(CURRENT.solutions);

  // ============================================================
  // 5) HTML DEL HEADER
  // ============================================================
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100" id="navHeader">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- ============================================================
             LOGO OFICIAL
             CHANGE #84
             Se usa /images/logo.png y fallback a romanoti-icon.png
             ============================================================ -->
      <a href="${CURRENT.home}" class="flex items-center shrink-0">
        <img
          src="/images/romanoti-logo-small.svg"
          alt="${I18N.brand}"
          class="h-12 md:h-14 w-auto object-contain block"
          onerror="this.onerror=null;this.src='/images/romanoti-icon.png';"
        >
      </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="${CURRENT.home}" class="text-gray-700 hover:text-blue-600">${I18N.home}</a>

          <!-- SERVICES -->
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
                 class="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2 hidden z-40"
                 role="menu"
                 aria-labelledby="navServicesBtn">
              ${servicesMenuHtml}
            </div>
          </div>

          <!-- SOLUTIONS -->
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
                 class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2 hidden z-40"
                 role="menu"
                 aria-labelledby="navSolutionsBtn">
              ${solutionsMenuHtml}
            </div>
          </div>

          <!-- PLATFORM -->
          <a href="${CURRENT.platform}" class="text-gray-700 hover:text-blue-600">${I18N.platform}</a>

          <!-- ENTERPRISE -->
          <a href="${CURRENT.enterprise}" class="text-gray-700 hover:text-blue-600">${I18N.enterprise}</a>

          <!-- WHY ROMANOTI -->
          <a href="${CURRENT.whyRomanoti}" class="text-gray-700 hover:text-blue-600">${I18N.whyRomanoti}</a>

          <a href="${CURRENT.contact}" class="text-gray-700 hover:text-blue-600">${I18N.contact}</a>

          <a href="${CURRENT.booking}" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            ${I18N.book}
          </a>

          <!-- LANGUAGE -->
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

            <div id="langMenu" class="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black/5 hidden z-40">
              <a href="#" data-lang="en" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇬🇧 ${I18N_MAP.en.en}</a>
              <a href="#" data-lang="fr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇫🇷 ${I18N_MAP.fr.fr}</a>
              <a href="#" data-lang="es" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇪🇸 ${I18N_MAP.es.es}</a>
            </div>
          </div>
        </nav>

        <!-- MOBILE CTA -->
        <div class="md:hidden">
          <a href="${CURRENT.home}" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.mobileCta}</a>
        </div>
      </div>
    </div>
  </header>`;

  // ============================================================
  // 6) MOUNT DEL HEADER
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
  // 7) NORMALIZACIÓN DE RUTA PARA CAMBIO DE IDIOMA
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
  // ============================================================
  async function goToLanguage(targetLang) {
    try {
      localStorage.setItem('lang', targetLang);
    } catch (e) {}

    const currentPath = cleanPath(window.location.pathname);

    let prefix = '/en';
    let fallback = '/';

    if (targetLang === 'fr') {
      prefix = '/fr';
      fallback = '/';
    } else if (targetLang === 'es') {
      prefix = '/es';
      fallback = '/';
    }

    const target = prefix + (currentPath.startsWith('/') ? currentPath : `/${currentPath}`);

    try {
      const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });
      if (res.ok) {
        window.location.href = target + window.location.search + window.location.hash;
      } else {
        window.location.href = fallback;
      }
    } catch (_) {
      window.location.href = fallback;
    }
  }

  // ============================================================
  // 9) WIRING DE MENÚS
  // ============================================================
  function wireDropdown(rootId, btnId, menuId) {
    const root = document.getElementById(rootId);
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);

    if (!root || !btn || !menu || btn.dataset.wired) return;

    let closeTimer = null;

    const open = () => {
      clearTimeout(closeTimer);
      menu.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    };

    const scheduleClose = () => {
      closeTimer = setTimeout(close, 180);
    };

    btn.addEventListener('mouseenter', open);
    menu.addEventListener('mouseenter', () => clearTimeout(closeTimer));

    btn.addEventListener('mouseleave', scheduleClose);
    menu.addEventListener('mouseleave', scheduleClose);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.contains('hidden') ? open() : close();
    });

    document.addEventListener('click', (e) => {
      if (!root.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    root.style.overflow = 'visible';
    btn.dataset.wired = '1';
  }

  function wireLanguageMenu() {
    const langBtn = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');

    if (!langBtn || !langMenu || langBtn.dataset.wired) return;

    const close = () => langMenu.classList.add('hidden');

    langBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      langMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!langMenu.contains(e.target) && e.target !== langBtn) {
        close();
      }
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

  function wireMenus() {
    wireDropdown('navServicesRoot', 'navServicesBtn', 'navServicesMenu');
    wireDropdown('navSolutionsRoot', 'navSolutionsBtn', 'navSolutionsMenu');
    wireLanguageMenu();
  }

  // ============================================================
  // 10) BOOT
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
