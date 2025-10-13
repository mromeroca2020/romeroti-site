<!-- /js/nav.js -->
<script>
(function(){
  // 1) Construimos el header unificado
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          RomanoTI Solutions
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>

          <!-- Dropdown Solutions -->
          <div class="relative" id="navSolutionsRoot">
            <button id="navSolutionsBtn"
                    class="text-gray-700 hover:text-blue-600 inline-flex items-center"
                    aria-haspopup="true" aria-expanded="false" aria-controls="navSolutionsMenu">
              Solutions
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div id="navSolutionsMenu"
                 class="absolute right-0 mt-2 w-72 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden"
                 role="menu" aria-labelledby="navSolutionsBtn">
              <a href="/solutions/"                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Overview</a>
              <a href="/solutions/cybershield/"                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">CyberShield (MDR)</a>
              <a href="/solutions/cybershield/soc-console.html"    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">SOC Console</a>
              <a href="/solutions/cybershield/easm-console.html"   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">EASM Console</a>
              <a href="/solutions/cybershield/field-kit.html"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Field Kit (engineers)</a>
              <div class="border-t my-1"></div>
              <a href="/solutions/cybershield/quick-audit.html"    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">Quick Audit</a>
              <a href="/solutions/cybershield/pov-14d.html"        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">POV 14 días</a>
            </div>
          </div>

          <a href="/services/tools.html" class="text-gray-700 hover:text-blue-600">Tools</a>
          <a href="/it-noc.html"         class="text-gray-700 hover:text-blue-600">NOC</a>
          <a href="/it-soc.html"         class="text-gray-700 hover:text-blue-600">SOC</a>
          <a href="https://calendly.com/mauricioromeroca"
             class="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">Book Now</a>
        </nav>

        <!-- Mobile nav (link directo a Solutions) -->
        <div class="md:hidden">
          <a href="/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Solutions</a>
        </div>
      </div>
    </div>
  </header>
  `;

  // 2) Inyectamos en #app-header, con fallback si no existe
  function mountHeader(){
    const mount = document.getElementById('app-header');
    if (mount) {
      mount.innerHTML = html;
    } else {
      // si no existe el mountpoint, insertamos al inicio del body
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }
  }

  // 3) Cableado robusto del dropdown
  function wireSolutions(){
    const btn  = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');
    if (!btn || !menu || btn.dataset.wired) return;

    const open  = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
    const close = () => { menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };
    const toggle= () => (menu.classList.contains('hidden') ? open() : close());

    // Click del botón
    btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(); });

    // Hover (desktop)
    btn.addEventListener('mouseenter', open);
    root.addEventListener('mouseleave', ()=> setTimeout(close, 120));

    // Click fuera
    document.addEventListener('click', (e)=>{ if (!menu.contains(e.target) && e.target !== btn) close(); });

    // ESC para cerrar
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });

    // Evitar que se corte el menú por overflow
    if (root) root.style.overflow = 'visible';

    btn.dataset.wired = '1';
  }

  // 4) Arranque
  function boot(){
    mountHeader();
    wireSolutions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> { boot(); setTimeout(wireSolutions, 200); setTimeout(wireSolutions, 800); });
  } else {
    boot();
    setTimeout(wireSolutions, 200);
    setTimeout(wireSolutions, 800);
  }
})();
</script>
