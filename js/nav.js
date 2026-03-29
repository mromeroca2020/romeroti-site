(function () {
  // ============================================================
  // Romanoti Solutions - Global nav.js
  // CHANGE #92
  // ------------------------------------------------------------
  // Fixes included:
  // - Services and Solutions have real clickable links
  // - Dropdowns open from separate caret buttons
  // - No invalid <a> inside <button>
  // - Header spacing remains stable
  // - CRM and language switch remain intact
  // ============================================================

  if (window.__ROMANOTI_NAV_BOOTED__) {
    console.warn('[nav] Already booted. Skipping duplicate init.');
    return;
  }
  window.__ROMANOTI_NAV_BOOTED__ = true;

  const path = window.location.pathname || '/';

  let lang = 'en';
  if (path === '/fr' || path.startsWith('/fr/')) {
    lang = 'fr';
  } else if (path === '/es' || path.startsWith('/es/')) {
    lang = 'es';
  } else if (path === '/en' || path.startsWith('/en/')) {
    lang = 'en';
  }

  const I18N_MAP = {
    es: {
      brand: 'Romanoti Solutions',
      home: 'Inicio',
      services: 'Servicios',
      solutions: 'Soluciones',
      platform: 'Plataforma',
      enterprise: 'Enterprise',
      whyRomanoti: 'Por qué Romanoti',
      howWeWork: 'Cómo trabajamos',
      contact: 'Contacto',
      book: 'Agendar',
      staffLogin: 'Acceso Personal',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Redes e infraestructura',
      cybersecurity: 'Ciberseguridad',
      tools: 'Herramientas y diagnóstico',
      solutionsOverview: 'Resumen de soluciones',
      platformOverview: 'Resumen de plataforma',
      governmentBusiness: 'Government & Enterprise',
      mobileCta: 'Soluciones',
      mobileStaffLogin: 'Acceso CRM'
    },
    en: {
      brand: 'Romanoti Solutions',
      home: 'Home',
      services: 'Services',
      solutions: 'Solutions',
      platform: 'Platform',
      enterprise: 'Enterprise',
      whyRomanoti: 'Why Romanoti',
      howWeWork: 'How We Work',
      contact: 'Contact',
      book: 'Book Now',
      staffLogin: 'Staff Login',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Networks & Infrastructure',
      cybersecurity: 'Cybersecurity',
      tools: 'Tools & Diagnostics',
      solutionsOverview: 'Solutions Overview',
      platformOverview: 'Platform Overview',
      governmentBusiness: 'Government & Enterprise',
      mobileCta: 'Solutions',
      mobileStaffLogin: 'CRM Login'
    },
    fr: {
      brand: 'Romanoti Solutions',
      home: 'Accueil',
      services: 'Services',
      solutions: 'Solutions',
      platform: 'Plateforme',
      enterprise: 'Entreprise',
      whyRomanoti: 'Pourquoi Romanoti',
      howWeWork: 'Notre méthode',
      contact: 'Contact',
      book: 'Prendre RDV',
      staffLogin: 'Accès Équipe',
      helpDesk: 'Help Desk / ITSM',
      networksInfra: 'Réseaux et infrastructure',
      cybersecurity: 'Cybersécurité',
      tools: 'Outils et diagnostic',
      solutionsOverview: 'Aperçu des solutions',
      platformOverview: 'Aperçu de la plateforme',
      governmentBusiness: 'Government & Enterprise',
      mobileCta: 'Solutions',
      mobileStaffLogin: 'Accès CRM'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;

  const ROUTES = {
    en: {
      home: '/',
      servicesIndex: '/en/services/index.html',
      solutionsIndex: '/solutions/index.html',
      platform: '/platform/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/solutions/why-romanoti.html',
      howWeWork: '/how-we-work.html',
      contact: '/contact.html',
      booking: '/booking.html',
      crmLogin: '/crm-login.html',
      services: [
        { key: 'helpDesk', href: '/services/helpdesk.html' },
        { key: 'networksInfra', href: '/en/services/networks.html' },
        { key: 'cybersecurity', href: '/en/services/cybersecurity.html' },
        { key: 'tools', href: '/services/tools.html' }
      ],
      solutions: [
        { key: 'solutionsOverview', href: '/solutions/index.html' },
        { key: 'platformOverview', href: '/platform/index.html' },
        { key: 'governmentBusiness', href: '/enterprise/government-business.html' }
      ]
    },
        fr: {
      home: '/fr/',
      servicesIndex: '/fr/services/index.html',
      solutionsIndex: '/fr/solutions/index.html',
      platform: '/fr/platform/index.html',
      enterprise: '/fr/entreprise/government-business.html',
      whyRomanoti: '/fr/solutions/why-romanoti.html',
      howWeWork: '/fr/how-we-work.html',
      contact: '/fr/contact.html',
      booking: '/fr/booking.html',
      crmLogin: '/fr/crm-login.html',
      services: [
        { key: 'helpDesk', href: '/fr/services/helpdesk.html' },
        { key: 'networksInfra', href: '/fr/services/networks.html' },
        { key: 'cybersecurity', href: '/fr/services/cybersecurity.html' },
        { key: 'tools', href: '/fr/services/tools.html' }
      ],
      solutions: [
        { key: 'solutionsOverview', href: '/fr/solutions/index.html' },
        { key: 'platformOverview', href: '/fr/platform/index.html' },
        { key: 'governmentBusiness', href: '/fr/entreprise/government-business.html' }
      ]
    },
    es: {
      home: '/es/',
      servicesIndex: '/es/services/index.html',
      solutionsIndex: '/es/soluciones/index.html',
      platform: '/es/platform/index.html',
      enterprise: '/es/enterprise/government-business.html',
      whyRomanoti: '/es/solutions/why-romanoti.html',
      howWeWork: '/es/solutions/how-we-work.html',
      contact: '/es/contact.html',
      booking: '/es/booking.html',
      crmLogin: '/crm-login.html',
      services: [
        { key: 'helpDesk', href: '/es/services/helpdesk.html' },
        { key: 'networksInfra', href: '/es/services/networks.html' },
        { key: 'cybersecurity', href: '/es/services/cybersecurity.html' },
        { key: 'tools', href: '/es/services/tools.html' }
      ],
      solutions: [
        { key: 'solutionsOverview', href: '/es/soluciones/index.html' },
        { key: 'platformOverview', href: '/es/platform/index.html' },
        { key: 'governmentBusiness', href: '/es/enterprise/government-business.html' }
      ]
    }
  };

  const CURRENT = ROUTES[lang] || ROUTES.en;

  function buildDropdownLinks(items) {
    return items.map((item) => {
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

  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100 shadow-sm" id="navHeader">
    <div class="max-w-screen-2xl mx-auto px-6 lg:px-8 xl:px-10 py-3.5">
      <div class="flex items-center justify-between gap-6 xl:gap-8">

        <a href="${CURRENT.home}" class="flex items-center shrink-0 mr-4 xl:mr-6">
          <img
            src="/images/romanoti-logo-small.svg"
            alt="${I18N.brand}"
            class="h-10 lg:h-11 xl:h-12 w-auto object-contain block"
            onerror="this.onerror=null;this.src='/images/romanoti-icon.png';"
          >
        </a>

        <nav class="hidden md:flex items-center gap-4 lg:gap-5 xl:gap-6 flex-1 min-w-0 text-[13px] lg:text-[14px] xl:text-[15px]">
          <a href="${CURRENT.home}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.home}</a>

          <div class="relative shrink-0" id="navServicesRoot">
            <div class="inline-flex items-center whitespace-nowrap">
              <a href="${CURRENT.servicesIndex}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.services}</a>
              <button id="navServicesBtn"
                      class="ml-1 text-gray-700 hover:text-blue-600 inline-flex items-center"
                      aria-haspopup="true"
                      aria-expanded="false"
                      aria-controls="navServicesMenu"
                      type="button">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>

            <div id="navServicesMenu"
                 class="absolute left-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2 hidden z-40"
                 role="menu"
                 aria-labelledby="navServicesBtn">
              ${servicesMenuHtml}
            </div>
          </div>

          <div class="relative shrink-0" id="navSolutionsRoot">
            <div class="inline-flex items-center whitespace-nowrap">
              <a href="${CURRENT.solutionsIndex}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.solutions}</a>
              <button id="navSolutionsBtn"
                      class="ml-1 text-gray-700 hover:text-blue-600 inline-flex items-center"
                      aria-haspopup="true"
                      aria-expanded="false"
                      aria-controls="navSolutionsMenu"
                      type="button">
                <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>

            <div id="navSolutionsMenu"
                 class="absolute left-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-2 hidden z-40"
                 role="menu"
                 aria-labelledby="navSolutionsBtn">
              ${solutionsMenuHtml}
            </div>
          </div>

          <a href="${CURRENT.platform}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.platform}</a>
          <a href="${CURRENT.enterprise}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.enterprise}</a>
          <a href="${CURRENT.whyRomanoti}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.whyRomanoti}</a>
          <a href="${CURRENT.howWeWork}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.howWeWork}</a>
          <a href="${CURRENT.contact}" class="text-gray-700 hover:text-blue-600 whitespace-nowrap">${I18N.contact}</a>
        </nav>

        <div class="hidden md:flex items-center gap-3 lg:gap-4 shrink-0 ml-3 lg:ml-4 xl:ml-6">
          <a href="${CURRENT.booking}"
             class="bg-blue-600 text-white px-4 lg:px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition whitespace-nowrap text-[13px] lg:text-[14px]">
            ${I18N.book}
          </a>

          <a href="${CURRENT.crmLogin}"
             class="hidden xl:inline-flex text-gray-400 hover:text-blue-600 text-sm font-medium whitespace-nowrap"
             title="Romanoti Internal Access">
            ${I18N.staffLogin}
          </a>

          <div class="relative shrink-0" id="langRoot">
            <button id="langBtn"
                    class="text-gray-500 hover:text-blue-600 inline-flex items-center font-medium whitespace-nowrap text-[13px] lg:text-[14px]"
                    aria-haspopup="true"
                    aria-expanded="false"
                    aria-controls="langMenu"
                    type="button">
              EN / FR / ES
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div id="langMenu"
                 class="absolute right-0 mt-2 w-28 rounded-lg bg-white shadow-lg ring-1 ring-black/5 hidden z-40">
              <a href="#" data-lang="en" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">EN</a>
              <a href="#" data-lang="fr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">FR</a>
              <a href="#" data-lang="es" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">ES</a>
            </div>
          </div>
        </div>

        <div class="md:hidden flex items-center gap-3">
          <a href="${CURRENT.crmLogin}" class="text-sm text-gray-600 hover:text-blue-600 font-medium">${I18N.mobileStaffLogin}</a>
          <a href="${CURRENT.home}" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.mobileCta}</a>
        </div>
      </div>
    </div>
  </header>`;

  function mountHeader() {
    if (document.documentElement.getAttribute('data-nav-mounted') === '1') {
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
  }

  function cleanPath(pathname) {
    if (!pathname) return '/';
    let out = pathname.replace(/^\/(en|fr|es)(?=\/|$)/, '');
    if (!out) out = '/';
    out = out.replace(/\/{2,}/g, '/');
    out = out.replace(/\/index\.html$/i, '/');
    return out;
  }

  async function goToLanguage(targetLang) {
    try { localStorage.setItem('lang', targetLang); } catch (e) {}
    const currentPath = cleanPath(window.location.pathname);
    let prefix = '/en';
    let fallback = '/';
    if (targetLang === 'fr') prefix = '/fr';
    if (targetLang === 'es') prefix = '/es';
    const target = prefix + (currentPath.startsWith('/') ? currentPath : `/${currentPath}`);
    try {
      const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });
      if (res.ok) window.location.href = target + window.location.search + window.location.hash;
      else window.location.href = fallback;
    } catch (_) {
      window.location.href = fallback;
    }
  }

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
      if (!langMenu.contains(e.target) && e.target !== langBtn) close();
    });
    langMenu.querySelectorAll('a[data-lang]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        goToLanguage(link.dataset.lang || 'en');
      });
    });
    langBtn.dataset.wired = '1';
  }

  function boot() {
    mountHeader();
    wireDropdown('navServicesRoot', 'navServicesBtn', 'navServicesMenu');
    wireDropdown('navSolutionsRoot', 'navSolutionsBtn', 'navSolutionsMenu');
    wireLanguageMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
