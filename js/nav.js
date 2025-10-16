<!-- /js/nav.js -->
<script>
/**
 * nav.js — Header unificado con submenú "Solutions" y soporte multi-idioma (ES/EN/FR)
 * ---------------------------------------------------------------------------------
 * Este archivo:
 *  1) Detecta el idioma según el prefijo de ruta (/en/, /fr/, o ES por defecto)
 *  2) Genera HTML del header + submenú Solutions
 *  3) Inyecta el header en #app-header (o lo coloca al inicio del <body> si no existe)
 *  4) Cablea la interacción del submenú (click/hover/escape/click fuera)
 *
 * Notas:
 *  - Para que el link a "Quick Audit" soporte ?thanks=1 sin 404 en Netlify,
 *    enlazamos a la ruta "bonita" sin .html: /solutions/cybershield/quick-audit
 *    (si tu build/preview no tiene _redirects, puedes cambiar a quick-audit.html).
 *  - En los HTML, carga este archivo con un sufijo de versión para romper caché:
 *      <script defer src="/js/nav.js?v=2025-02"></script>
 */

(function(){
  // ========= 0) Marca de build para depuración rápida en consola =========
  const BUILD = '2025-02';
  // Verás esto en DevTools → Console. Útil para confirmar que corrió la versión correcta.
  console.log('nav.js build', BUILD);

  // ========= 1) Detección de idioma y cálculo de base de rutas =========
  // Tomamos la ruta actual y decidimos el idioma por prefijo: /en/... → 'en', /fr/... → 'fr', otro → 'es'
  const pathname = location.pathname;
  const lang =
    pathname.startsWith('/en/') ? 'en' :
    pathname.startsWith('/fr/') ? 'fr' : 'es';

  // Prefijo base a anteponer en todos los <a href="..."> del header
  //  - ES (por defecto) no lleva prefijo → ''
  //  - EN: '/en'
  //  - FR: '/fr'
  const base = (lang === 'en') ? '/en' : (lang === 'fr') ? '/fr' : '';

  // ========= 2) Diccionario mínimo de textos por idioma =========
  // Puedes ampliar este objeto sin tocar el resto del código.
  const LABELS = {
    es: {
      brand: 'RomanoTI Solutions',
      home: 'Home',
      solutions: 'Solutions',
      tools: 'Tools',
      noc: 'NOC',
      soc: 'SOC',
      book: 'Book Now',
      // Submenú
      overview: 'Overview',
      mdr: 'CyberShield (MDR)',
      socConsole: 'SOC Console',
      easm: 'EASM Console',
      fieldKit: 'Field Kit (engineers)',
      quickAudit: 'Quick Audit',
      pov: 'POV 14 días'
    },
    en: {
      brand: 'RomanoTI Solutions',
      home: 'Home',
      solutions: 'Solutions',
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
      pov: '14-day POV'
    },
    fr: {
      brand: 'RomanoTI Solutions',
      home: 'Accueil',
      solutions: 'Solutions',
      tools: 'Outils',
      noc: 'NOC',
      soc: 'SOC',
      book: 'Prendre RDV',
      overview: 'Aperçu',
      mdr: 'CyberShield (MDR)',
      socConsole: 'Console SOC',
      easm: 'Console EASM',
      fieldKit: 'Field Kit (ingénieurs)',
      quickAudit: 'Audit Rapide',
      pov: 'POV 14 jours'
    }
  }[lang];

  // ========= 3) Plantilla HTML del header =========
  // - Usa Tailwind para estilos
  // - Accesibilidad: aria-haspopup, aria-expanded, role="menu" en el dropdown
  // - Los enlaces usan el prefijo base calculado arriba
  const headerHTML = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Marca / Logo -->
        <a href="${base || '/'}" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          ${LABELS.brand}
        </a>

        <!-- Navegación Desktop -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="${base || '/'}" class="text-gray-700 hover:text-blue-600">${LABELS.home}</a>

          <!-- Dropdown Solutions -->
          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navSolutionsMenu">
              ${LABELS.solutions}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>

            <div id="navSolutionsMenu"
                 class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden"
                 role="menu" aria-labelledby="navSolutionsBtn">
              <a href="${base}/solutions/"                             class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.overview}</a>
              <a href="${base}/solutions/cybershield/"                 class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.mdr}</a>
              <a href="${base}/solutions/cybershield/soc-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.socConsole}</a>
              <a href="${base}/solutions/cybershield/easm-console.html"class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.easm}</a>
              <a href="${base}/solutions/cybershield/field-kit.html"   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.fieldKit}</a>
              <div class="border-t my-1"></div>
              <!-- Quick Audit sin .html para soportar ?thanks=1 con pretty URLs -->
              <a href="${base}/solutions/cybershield/quick-audit"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.quickAudit}</a>
              <a href="${base}/solutions/cybershield/pov-14d.html"     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${LABELS.pov}</a>
            </div>
          </div>

          <a href="${base}/services/tools.html" class="text-gray-700 hover:text-blue-600">${LABELS.tools}</a>
          <a href="${base}/it-noc.html"         class="text-gray-700 hover:text-blue-600">${LABELS.noc}</a>
          <a href="${base}/it-soc.html"         class="text-gray-700 hover:text-blue-600">${LABELS.soc}</a>

          <a href="https://calendly.com/mauricioromeroca"
             class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">${LABELS.book}</a>
        </nav>

        <!-- Botón móvil (lleva directo a Solutions overview) -->
        <div class="md:hidden">
          <a href="${base}/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${LABELS.solutions}</a>
        </div>
      </div>
    </div>
  </header>`;

  // ========= 4) Inyección del header en el DOM =========
  function mountHeader(){
    const mount = document.getElementById('app-header');
    if (mount) {
      // Si existe el mountpoint, lo usamos (esto permite ocultar un fallback si lo tuvieras)
      mount.innerHTML = headerHTML;
    } else {
      // Si no existe #app-header, lo insertamos al inicio del body como fallback
      const temp = document.createElement('div');
      temp.innerHTML = headerHTML;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }
  }

  // ========= 5) Cableado del submenú Solutions =========
  function wireSolutions(){
    const btn  = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');
    // Evitamos cablear dos veces
    if (!btn || !menu || btn.dataset.wired) return;

    // Helpers para abrir/cerrar con accesibilidad
    const open  = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
    const close = () => { menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };
    const toggle= () => (menu.classList.contains('hidden') ? open() : close());

    // 1) Click en el botón (desktop/tablet): abre/cierra
    btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(); });
    // 2) Hover: abrir al entrar, cerrar al salir (pequeño delay)
    btn.addEventListener('mouseenter', open);
    root.addEventListener('mouseleave', ()=> setTimeout(close, 120));
    // 3) Click fuera: cierra
    document.addEventListener('click', (e)=>{ if (!menu.contains(e.target) && e.target !== btn) close(); });
    // 4) ESC: cierra
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });
    // 5) Overflow: evita que el menú se “corte” en contenedores con overflow hidden
    if (root) root.style.overflow = 'visible';

    // Marca para evitar múltiples cableados
    btn.dataset.wired = '1';
  }

  // ========= 6) Arranque “a prueba de caché” =========
  // Montamos el header y cableamos; repetimos wireSolutions luego de pequeños delays
  // por si el navegador demoró estilos/DOM (esto hace el header robusto).
  function boot(){
    mountHeader();
    wireSolutions();
    setTimeout(wireSolutions, 200);
    setTimeout(wireSolutions, 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
</script>
