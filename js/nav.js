(function () {
  // ============================================================
  // RomanoTI nav.js — Header global + selector de idioma + menú
  // ============================================================

  if (window.__ROMANOTI_NAV_BOOTED__) {
    console.warn('[nav] Already booted. Skipping duplicate init.');
    return;
  }
  window.__ROMANOTI_NAV_BOOTED__ = true;

  console.log('[nav] booting…');

  // ============================================================
  // Detect language
  // "/" and most root pages = English
  // "/fr" = French
  // "/es" = Spanish only if explicitly present
  // ============================================================
  const path = location.pathname || '/';

  const lang =
    (path === '/' || path.startsWith('/en/') || path === '/en' || (!path.startsWith('/fr/') && !path.startsWith('/es/'))) ? 'en'
    : (path.startsWith('/fr/') || path === '/fr') ? 'fr'
    : 'es';

  // ============================================================
  // Base paths
  // Keep EN in root for now
  // Keep FR under /fr
  // Keep ES in root too until /es is fully deployed
  // ============================================================
  const base =
    (lang === 'en') ? ''
    : (lang === 'fr') ? '/fr'
    : '';

  const I18N_MAP = {
    es: {
      brand: 'RomanoTI Solutions',
      home: 'Inicio', solutions: 'Soluciones', platform: 'Platform', tools: 'Herramientas',
      noc: 'NOC', soc: 'SOC', book: 'Agendar',
      overview: 'Resumen', mdr: 'CyberShield (MDR)', socConsole: 'Consola SOC',
      easm: 'Consola EASM', fieldKit: 'Field Kit (ingenieros)',
      quickAudit: 'Auditoría rápida', pov: 'POV 14 días',
      lang: 'Idioma', en: 'English', fr: 'Français', es: 'Español',
      services: 'Servicios',
      serviceCloud: 'Cloud Migration',
      serviceInfra: 'Infraestructura TI',
      serviceCyber: 'Ciberseguridad',
      serviceDC: 'Data Center & Virtualización',
      serviceDR: 'Backups y DRP',
      serviceNOC: 'Servicios NOC',
      dcMonitor: 'DC Monitor'
    },
    en: {
      brand: 'RomanoTI Solutions',
      home: 'Home', solutions: 'Solutions', platform: 'Platform', tools: 'Tools',
      noc: 'NOC', soc: 'SOC', book: 'Book Now',
      overview: 'Overview', mdr: 'CyberShield (MDR)', socConsole: 'SOC Console',
      easm: 'EASM Console', fieldKit: 'Field Kit (engineers)',
      quickAudit: 'Quick Audit', pov: '14-day POV',
      lang: 'Language', en: 'English', fr: 'Français', es: 'Español',
      services: 'Services',
      serviceCloud: 'Cloud Migration',
      serviceInfra: 'IT Infrastructure',
      serviceCyber: 'Cybersecurity',
      serviceDC: 'Data Center & Virtualization',
      serviceDR: 'Backups & Disaster Recovery',
      serviceNOC: 'NOC Services',
      dcMonitor: 'DC Monitor'
    },
    fr: {
      brand: 'RomanoTI Solutions',
      home: 'Accueil', solutions: 'Solutions', platform: 'Platform', tools: 'Outils',
      noc: 'NOC', soc: 'SOC', book: 'Prendre RDV',
      overview: 'Aperçu', mdr: 'CyberShield (MDR)', socConsole: 'Console SOC',
      easm: 'Console EASM', fieldKit: 'Field Kit (ingénieurs)',
      quickAudit: 'Audit rapide', pov: 'POV 14 jours',
      lang: 'Langue', en: 'English', fr: 'Français', es: 'Español',
      services: 'Services',
      serviceCloud: 'Migration vers le cloud',
      serviceInfra: 'Infrastructure TI',
      serviceCyber: 'Cybersécurité',
      serviceDC: 'Centre de données & Virtualisation',
      serviceDR: 'Sauvegardes & PRA',
      serviceNOC: 'Services NOC',
      dcMonitor: 'DC Monitor'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;
  const homeHref = (base ? `${base}/` : '/');

  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100" id="navHeader">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="${homeHref}" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          ${I18N.brand}
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="${homeHref}" class="text-gray-700 hover:text-blue-600">${I18N.home}</a>

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

  <!-- ============================================================
       Romanoti Services Navigation
       Uses only verified pages from current project tree
       ============================================================ -->

  <a href="/services.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     Services Overview
  </a>

  <a href="/cloud-hybrid.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     Hybrid Cloud Infrastructure
  </a>

  <a href="/cloud-redundancy.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     Cloud Redundancy
  </a>

  <a href="/cybersecurity.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     Cybersecurity
  </a>

  <a href="/it-noc.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     NOC Services
  </a>

  <a href="/it-soc.html"
     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
     role="menuitem">
     SOC Services
  </a>

</div>

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
              <a href="${base}/solutions/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.overview}</a>
              <a href="${base}/solutions/cybershield/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.mdr}</a>
              <a href="${base}/solutions/cybershield/soc-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.socConsole}</a>
              <a href="${base}/solutions/cybershield/easm-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.easm}</a>
              <a href="${base}/solutions/cybershield/field-kit.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.fieldKit}</a>
              <div class="border-t my-1"></div>
              <a href="${base}/solutions/cybershield/quick-audit.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.quickAudit}</a>
              <a href="${base}/solutions/cybershield/pov-14d.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.pov}</a>
            </div>
          </div>

          <a href="/platform/index.html" class="text-gray-700 hover:text-blue-600">${I18N.platform}</a>
          <a href="${base}/services/tools.html" class="text-gray-700 hover:text-blue-600">${I18N.tools}</a>
          <a href="${base}/it-noc.html" class="text-gray-700 hover:text-blue-600">${I18N.noc}</a>
          <a href="/en/data-center/dashboard.html" class="text-gray-700 hover:text-blue-600">${I18N.dcMonitor}</a>
          <a href="${base}/it-soc.html" class="text-gray-700 hover:text-blue-600">${I18N.soc}</a>

          <a href="https://calendly.com/mauricioromeroca" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">${I18N.book}</a>

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

        <div class="md:hidden">
          <a href="${base}/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.solutions}</a>
        </div>
      </div>
    </div>
  </header>`;

  function mountHeader() {
    if (document.documentElement.getAttribute('data-nav-mounted') === '1') {
      console.warn('[nav] Header already mounted, skipping mount.');
      window.ROMANOTI_NAV_READY = true;
      return;
    }

    const mount = document.getElementById('app-header');
    if (mount) {
      mount.innerHTML = html;
    } else {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }

    document.documentElement.setAttribute('data-nav-mounted', '1');
    window.ROMANOTI_NAV_READY = true;
  }

  function cleanPath(p) {
    if (!p) return '/';

    let out = p.replace(/^\/(en|fr|es)(?=\/|$)/, '');
    if (!out) out = '/';
    out = out.replace(/\/{2,}/g, '/');
    out = out.replace(/\/index\.html$/i, '/');
    return out;
  }

  async function goToLanguage(targetLang) {
    try { localStorage.setItem('lang', targetLang); } catch (e) {}

    const current = cleanPath(location.pathname);

    let prefix, fallback;

    if (targetLang === 'en') {
      prefix = '/en';
      fallback = '/';
    } else if (targetLang === 'fr') {
      prefix = '/fr';
      fallback = '/fr/';
    } else {
      prefix = '';
      fallback = '/';
    }

    const target = prefix + (current.startsWith('/') ? current : '/' + current);

    if (targetLang === 'en' && current === '/') {
      location.href = '/' + location.search + location.hash;
      return;
    }

    try {
      const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });
      if (res.ok) {
        location.href = target + location.search + location.hash;
      } else {
        location.href = fallback;
      }
    } catch (_) {
      location.href = fallback;
    }
  }

  function wireMenus() {
    const btn = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');

    if (btn && menu && !btn.dataset.wired) {
      const open = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded', 'true'); };
      const close = () => { menu.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); };
      const toggle = (e) => { if (e) { e.preventDefault(); e.stopPropagation(); } menu.classList.contains('hidden') ? open() : close(); };

      btn.addEventListener('click', toggle);
      btn.addEventListener('mouseenter', open);
      root && root.addEventListener('mouseleave', () => setTimeout(close, 120));
      document.addEventListener('click', (e) => { if (!menu.contains(e.target) && e.target !== btn) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

      root && (root.style.overflow = 'visible');
      btn.dataset.wired = '1';
    }

    const sBtn = document.getElementById('navServicesBtn');
    const sMenu = document.getElementById('navServicesMenu');
    const sRoot = document.getElementById('navServicesRoot');

    if (sBtn && sMenu && !sBtn.dataset.wired) {
      let closeTimer = null;

      const sOpen = () => {
        clearTimeout(closeTimer);
        sMenu.classList.remove('hidden');
        sBtn.setAttribute('aria-expanded', 'true');
      };

      const sClose = () => {
        sMenu.classList.add('hidden');
        sBtn.setAttribute('aria-expanded', 'false');
      };

      const scheduleClose = () => {
        closeTimer = setTimeout(sClose, 250);
      };

      sBtn.addEventListener('mouseenter', sOpen);
      sMenu.addEventListener('mouseenter', () => clearTimeout(closeTimer));

      sBtn.addEventListener('mouseleave', scheduleClose);
      sMenu.addEventListener('mouseleave', scheduleClose);

      sBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        sMenu.classList.contains('hidden') ? sOpen() : sClose();
      });

      document.addEventListener('click', (e) => {
        if (!sRoot.contains(e.target)) sClose();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') sClose();
      });

      sRoot.style.overflow = 'visible';
      sBtn.dataset.wired = '1';
    }

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

      langMenu.querySelectorAll('a[data-lang]').forEach(a => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const targetLang = a.dataset.lang || 'es';
          goToLanguage(targetLang);
        });
      });

      langBtn.dataset.wired = '1';
    }
  }

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
