(function () {
  // ============================================================
  // RomanoTI nav.js — Header global + selector de idioma + menú
  // ============================================================
  // 🔒 IMPORTANTE (PRODUCCIÓN):
  // Este archivo puede llegar a incluirse accidentalmente 2 veces en HTML.
  // Para NO romper producción, añadimos un "guard" global que:
  // - evita montar el header dos veces
  // - evita cablear listeners duplicados
  //
  // ✅ FIX 1: Guard global anti-doble-carga
  // ✅ FIX 2: Persistir idioma en localStorage antes de redirigir (evita doble click)
  // ✅ FIX 3: HEAD con cache:'no-store' + fallback seguro
  // ============================================================

  // ------------------------------------------------------------
  // GUARD ANTI-DOBLE-CARGA (si nav.js se carga 2 veces por error)
  // ------------------------------------------------------------
  if (window.__ROMANOTI_NAV_BOOTED__) {
    // Si este log aparece, significa que nav.js se está cargando 2 veces en la página.
    console.warn('[nav] Already booted. Skipping duplicate init.');
    return;
  }
  window.__ROMANOTI_NAV_BOOTED__ = true;

  console.log('[nav] booting…');

  // 1) Detección de idioma por ruta
  const path = location.pathname || '/';

  // - "/" se considera inglés (tu convención actual)
  // - /en, /fr, /es siguen funcionando igual
  const lang =
    path === '/' ? 'en'
      : path.startsWith('/en/') ? 'en'
        : path === '/en' ? 'en'
          : path.startsWith('/fr/') ? 'fr'
            : path === '/fr' ? 'fr'
              : path.startsWith('/es/') ? 'es'
                : path === '/es' ? 'es'
                  : 'en'; // fallback seguro

  const base = lang === 'en' ? '/en'
    : lang === 'fr' ? '/fr'
      : '/es';

  // 2) Textos por idioma
  const I18N_MAP = {
    es: {
      brand: 'RomanoTI Solutions',
      home: 'Inicio', solutions: 'Soluciones', tools: 'Herramientas',
      noc: 'NOC', soc: 'SOC', book: 'Agendar',
      // Menú Solutions
      overview: 'Resumen', mdr: 'CyberShield (MDR)', socConsole: 'Consola SOC',
      easm: 'Consola EASM', fieldKit: 'Field Kit (ingenieros)',
      quickAudit: 'Auditoría rápida', pov: 'POV 14 días',
      // Language
      lang: 'Idioma', en: 'English', fr: 'Français', es: 'Español',
      // Menú Services
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
      home: 'Home', solutions: 'Solutions', tools: 'Tools',
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
      home: 'Accueil', solutions: 'Solutions', tools: 'Outils',
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

  const I18N = I18N_MAP[lang] || I18N_MAP.en; // ✅ fallback extra

  // 3) HTML del header
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
              <a href="${base}/services/cloud-migration"   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceCloud}</a>
              <a href="${base}/services/it-infrastructure" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceInfra}</a>
              <a href="${base}/services/cybersecurity"     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceCyber}</a>
              <a href="${base}/services/data-center"       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceDC}</a>
              <a href="${base}/services/disaster-recovery" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceDR}</a>
              <a href="${base}/services/noc"               class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.serviceNOC}</a>
            </div>
          </div>

          <!-- Dropdown Solutions -->
          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navSolutionsMenu">
              ${I18N.solutions}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
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

          <!-- DC Monitor (siempre en /en por ahora) -->
          <a href="/en/data-center/dashboard.html" class="text-gray-700 hover:text-blue-600">${I18N.dcMonitor}</a>

          <a href="${base}/it-soc.html"         class="text-gray-700 hover:text-blue-600">${I18N.soc}</a>
          <a href="https://calendly.com/mauricioromeroca" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">${I18N.book}</a>

          <div class="relative" id="langRoot">
            <button id="langBtn" class="text-gray-500 hover:text-blue-600 inline-flex items-center" aria-haspopup="true" aria-expanded="false">
              🌐 ${I18N.lang}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
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

  // 4) Montaje del header (con fallback si no existe #app-header)
  function mountHeader() {
    // ✅ FIX: si ya existe un header inyectado, no lo reinyectamos.
    // Esto protege producción cuando nav.js se carga 2 veces.
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

  // ---- Helpers idioma ----
  function cleanPath(p) {
    if (!p) return '/';
    let out = p.replace(/^\/(en|fr|es)(?=\/|$)/, '');
    if (!out) out = '/';
    out = out.replace(/\/{2,}/g, '/');
    out = out.replace(/\/index\.html$/i, '/');
    return out;
  }

  async function goToLanguage(targetLang) {
    // ✅ FIX: Persistimos el idioma ANTES de redirigir.
    // Esto evita el "primer click queda en inglés" si otras páginas/scripts
    // leen el idioma desde localStorage o lo usan como estado.
    try { localStorage.setItem('lang', targetLang); } catch (e) {}

    const prefix = targetLang === 'en' ? '/en' : targetLang === 'fr' ? '/fr' : '/es';
    const current = cleanPath(location.pathname);
    const target = prefix + (current.startsWith('/') ? current : '/' + current);
    const fallback = prefix + '/';

    try {
      // ✅ FIX: cache:'no-store' evita respuestas cacheadas raras (CDN/Netlify/Render)
      const res = await fetch(target, { method: 'HEAD', cache: 'no-store' });

      // Nota: algunos setups con rewrites devuelven 200 aunque el archivo no exista.
      // Por eso el fallback sigue existiendo.
      if (res.ok) {
        location.href = target + location.search + location.hash;
      } else {
        location.href = fallback;
      }
    } catch (_) {
      location.href = fallback;
    }
  }

  // 5) Cableado de menús (Solutions + Services + Idioma)
  function wireMenus() {
    // ---- Solutions submenu ----
    const btn = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');

    if (btn && menu && !btn.dataset.wired) {
      const open = () => {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      };
      const close = () => {
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      };
      const toggle = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        menu.classList.contains('hidden') ? open() : close();
      };

      btn.addEventListener('click', toggle);
      btn.addEventListener('mouseenter', open);
      root && root.addEventListener('mouseleave', () => setTimeout(close, 120));
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== btn) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });

      root && (root.style.overflow = 'visible');
      btn.dataset.wired = '1';
    }

    // ---- Services submenu ----
    const sBtn = document.getElementById('navServicesBtn');
    const sMenu = document.getElementById('navServicesMenu');
    const sRoot = document.getElementById('navServicesRoot');

    if (sBtn && sMenu && !sBtn.dataset.wired) {
      const sOpen = () => {
        sMenu.classList.remove('hidden');
        sBtn.setAttribute('aria-expanded', 'true');
      };
      const sClose = () => {
        sMenu.classList.add('hidden');
        sBtn.setAttribute('aria-expanded', 'false');
      };
      const sToggle = (e) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        sMenu.classList.contains('hidden') ? sOpen() : sClose();
      };

      sBtn.addEventListener('click', sToggle);
      sBtn.addEventListener('mouseenter', sOpen);
      sRoot && sRoot.addEventListener('mouseleave', () => setTimeout(sClose, 120));

      document.addEventListener('click', (e) => {
        if (!sMenu.contains(e.target) && e.target !== sBtn) sClose();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') sClose();
      });

      sRoot && (sRoot.style.overflow = 'visible');
      sBtn.dataset.wired = '1';
    }

    // ---- Language menu ----
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

      // Cambio de idioma (redirige a /en /fr /es manteniendo el path si existe)
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

  // 6) Boot
  function boot() {
    mountHeader();
    wireMenus();
    console.log('[nav] mounted & wired');
  }

  // ✅ Se mantiene tu lógica original de reintentos.
  // Con el guard global + data-nav-mounted, ya no habrá doble-montaje.
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
