<!-- /js/nav.js -->
<script>
(function(){
  /**
   * ================================================
   * 1) Detección de idioma y base path por idioma
   * -----------------------------------------------
   * - Tomamos el pathname actual (ej. /, /en/..., /fr/...)
   * - Elegimos 'es' por defecto si no hay prefijo /en/ o /fr/
   * - La variable "base" es el prefijo que se antepone a TODOS
   *   los href del menú para que navegue dentro del idioma actual.
   *   Ejemplos:
   *   - lang = 'en' => base = '/en'
   *   - lang = 'fr' => base = '/fr'
   *   - lang = 'es' => base = '' (sitio raíz)
   * ================================================
   */
  const p = location.pathname;
  const lang = p.startsWith('/en/') ? 'en' : p.startsWith('/fr/') ? 'fr' : 'es';
  const base = lang === 'en' ? '/en' : lang === 'fr' ? '/fr' : '';

  /**
   * ================================================
   * 2) Diccionario mínimo por idioma
   * -----------------------------------------------
   * - Mapea las etiquetas del menú según el idioma.
   * - Si agregas nuevas secciones, solo amplía este
   *   objeto (overview, mdr, etc.).
   * ================================================
   */
  const T = {
    es: {
      home:'Home', solutions:'Solutions', tools:'Tools',
      noc:'NOC', soc:'SOC', book:'Book Now',
      overview:'Overview', mdr:'CyberShield (MDR)', socConsole:'SOC Console',
      easm:'EASM Console', fieldKit:'Field Kit (engineers)',
      quickAudit:'Quick Audit', pov:'POV 14 días',
      brand:'RomanoTI Solutions'
    },
    en: {
      home:'Home', solutions:'Solutions', tools:'Tools',
      noc:'NOC', soc:'SOC', book:'Book Now',
      overview:'Overview', mdr:'CyberShield (MDR)', socConsole:'SOC Console',
      easm:'EASM Console', fieldKit:'Field Kit (engineers)',
      quickAudit:'Quick Audit', pov:'14-day POV',
      brand:'RomanoTI Solutions'
    },
    fr: {
      home:'Accueil', solutions:'Solutions', tools:'Outils',
      noc:'NOC', soc:'SOC', book:'Prendre RDV',
      overview:'Aperçu', mdr:'CyberShield (MDR)', socConsole:'Console SOC',
      easm:'Console EASM', fieldKit:'Field Kit (ingénieurs)',
      quickAudit:'Audit Rapide', pov:'POV 14 jours',
      brand:'RomanoTI Solutions'
    }
  }[lang];

  /**
   * ================================================
   * 3) Plantilla HTML del header
   * -----------------------------------------------
   * - Se genera como string para poder inyectarla
   *   en cualquier página que incluya este script.
   * - Incluye:
   *   - Logotipo / marca (izquierda)
   *   - Menú horizontal (desktop, md+)
   *   - Botón "Solutions" con submenú (dropdown)
   *   - Botón "Solutions" directo para móvil (md:hidden)
   * - IMPORTANTE:
   *   Todos los href usan "base" para respetar el idioma
   *   actual (es / en / fr). Así no se mezclan idiomas.
   * ================================================
   */
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo / brand -->
        <a href="\${base || '/'}" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          \${T.brand}
        </a>

        <!-- Menú desktop -->
        <nav class="hidden md:flex items-center space-x-8">
          <!-- Home -->
          <a href="\${base || '/'}" class="text-gray-700 hover:text-blue-600">\${T.home}</a>

          <!-- Dropdown Solutions -->
          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navSolutionsMenu">
              \${T.solutions}
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div id="navSolutionsMenu"
                 class="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden"
                 role="menu" aria-labelledby="navSolutionsBtn">
              <!-- Sección Solutions -->
              <a href="\${base}/solutions/"                              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.overview}</a>
              <a href="\${base}/solutions/cybershield/"                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.mdr}</a>
              <a href="\${base}/solutions/cybershield/soc-console.html"  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.socConsole}</a>
              <a href="\${base}/solutions/cybershield/easm-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.easm}</a>
              <a href="\${base}/solutions/cybershield/field-kit.html"    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.fieldKit}</a>

              <div class="border-t my-1"></div>

              <!-- Accesos directos comerciales -->
              <!-- OJO: quick-audit va SIN .html para URL limpia; requiere regla en _redirects -->
              <a href="\${base}/solutions/cybershield/quick-audit"       class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.quickAudit}</a>
              <a href="\${base}/solutions/cybershield/pov-14d.html"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">\${T.pov}</a>
            </div>
          </div>

          <!-- Resto del menú -->
          <a href="\${base}/services/tools.html" class="text-gray-700 hover:text-blue-600">\${T.tools}</a>
          <a href="\${base}/it-noc.html"         class="text-gray-700 hover:text-blue-600">\${T.noc}</a>
          <a href="\${base}/it-soc.html"         class="text-gray-700 hover:text-blue-600">\${T.soc}</a>
          <a href="https://calendly.com/mauricioromeroca" class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">\${T.book}</a>
        </nav>

        <!-- Botón Solutions directo para móvil -->
        <div class="md:hidden">
          <a href="\${base}/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">\${T.solutions}</a>
        </div>
      </div>
    </div>
  </header>`;

  /**
   * ================================================
   * 4) Inyección del header
   * -----------------------------------------------
   * - Si existe #app-header, se usa como mountpoint.
   * - Si no existe, se inserta al inicio del <body> (fallback).
   * ================================================
   */
  function mountHeader(){
    const mount = document.getElementById('app-header');
    if (mount) mount.innerHTML = html;
    else {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }
  }

  /**
   * ================================================
   * 5) Cableado del dropdown "Solutions"
   * -----------------------------------------------
   * - Abre/cierra por click.
   * - Abre por hover (mouseenter) y cierra al salir
   *   del contenedor root con un pequeño delay.
   * - Cierra al hacer click fuera y con tecla Escape.
   * - Marca el botón como "wired" para no duplicar listeners.
   * - Expone atributos ARIA (accessibility).
   * ================================================
   */
  function wireSolutions(){
    const btn  = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');
    if (!btn || !menu || btn.dataset.wired) return;

    const open  = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
    const close = () => { menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };
    const toggle= () => (menu.classList.contains('hidden') ? open() : close());

    // Click en el botón
    btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(); });

    // Hover (abre)
    btn.addEventListener('mouseenter', open);
    // Al salir del contenedor principal, cerramos
    root.addEventListener('mouseleave', ()=> setTimeout(close, 120));

    // Click fuera => cerrar
    document.addEventListener('click', (e)=>{ if (!menu.contains(e.target) && e.target !== btn) close(); });

    // Tecla ESC => cerrar
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });

    // Que el menú pueda sobresalir sin cortar (overflow)
    if (root) root.style.overflow = 'visible';

    // Evitar re-cableado
    btn.dataset.wired = '1';
  }

  /**
   * ================================================
   * 6) Arranque
   * -----------------------------------------------
   * - Monta el header y cablea el menú.
   * - Llama a wireSolutions de nuevo con pequeños
   *   timeouts para cubrir casos de carga diferida.
   * ================================================
   */
  function boot(){ mountHeader(); wireSolutions(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> { boot(); setTimeout(wireSolutions,200); setTimeout(wireSolutions,800); });
  } else { boot(); setTimeout(wireSolutions,200); setTimeout(wireSolutions,800); }
})();
</script>
