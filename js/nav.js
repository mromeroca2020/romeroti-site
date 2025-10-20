<!-- /js/nav.js -->
<script>
(function(){
  // ============ 1) Detección de idioma por ruta ============
  const path = location.pathname;
  const lang = path.startsWith('/en/') ? 'en' : path.startsWith('/fr/') ? 'fr' : 'es';
  const base = lang === 'en' ? '/en' : lang === 'fr' ? '/fr' : '';

  // ============ 2) Textos por idioma (header & dropdown) ============
  const I18N = {
    es: {
      brand:'RomanoTI Solutions',
      home:'Home', solutions:'Solutions', tools:'Tools',
      noc:'NOC', soc:'SOC', book:'Agendar',
      overview:'Overview', mdr:'CyberShield (MDR)', socConsole:'SOC Console',
      easm:'EASM Console', fieldKit:'Field Kit (engineers)',
      quickAudit:'Quick Audit', pov:'POV 14 días',
      lang:'Idioma', en:'English', fr:'Français', es:'Español'
    },
    en: {
      brand:'RomanoTI Solutions',
      home:'Home', solutions:'Solutions', tools:'Tools',
      noc:'NOC', soc:'SOC', book:'Book Now',
      overview:'Overview', mdr:'CyberShield (MDR)', socConsole:'SOC Console',
      easm:'EASM Console', fieldKit:'Field Kit (engineers)',
      quickAudit:'Quick Audit', pov:'14-day POV',
      lang:'Language', en:'English', fr:'Français', es:'Español'
    },
    fr: {
      brand:'RomanoTI Solutions',
      home:'Accueil', solutions:'Solutions', tools:'Outils',
      noc:'NOC', soc:'SOC', book:'Prendre RDV',
      overview:'Aperçu', mdr:'CyberShield (MDR)', socConsole:'Console SOC',
      easm:'Console EASM', fieldKit:'Field Kit (ingénieurs)',
      quickAudit:'Audit rapide', pov:'POV 14 jours',
      lang:'Langue', en:'English', fr:'Français', es:'Español'
    }
  }[lang];

  // ============ 3) Generar header ============
  const html = `
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-gray-100">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="${base || '/'}" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          ${I18N.brand}
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="${base || '/'}" class="text-gray-700 hover:text-blue-600">${I18N.home}</a>

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
              <a href="${base}/solutions/"                             class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.overview}</a>
              <a href="${base}/solutions/cybershield/"                 class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.mdr}</a>
              <a href="${base}/solutions/cybershield/soc-console.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.socConsole}</a>
              <a href="${base}/solutions/cybershield/easm-console.html"class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.easm}</a>
              <a href="${base}/solutions/cybershield/field-kit.html"   class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.fieldKit}</a>
              <div class="border-t my-1"></div>
              <a href="${base}/solutions/cybershield/quick-audit"      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.quickAudit}</a>
              <a href="${base}/solutions/cybershield/pov-14d.html"     class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" role="menuitem">${I18N.pov}</a>
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
              <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>
            </button>
            <div id="langMenu" class="absolute right-0 mt-2 w-44 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 hidden">
              <a href="#" data-lang="en" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇬🇧 ${I18N.en}</a>
              <a href="#" data-lang="fr" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇫🇷 ${I18N.fr}</a>
              <a href="#" data-lang="es" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">🇪🇸 ${I18N.es}</a>
            </div>
          </div>
        </nav>

        <!-- Mobile: link directo -->
        <div class="md:hidden">
          <a href="${base}/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">${I18N.solutions}</a>
        </div>
      </div>
    </div>
  </header>`;

  // ============ 4) Montaje ============
  function mountHeader(){
    const mount = document.getElementById('app-header');
    if (mount) mount.innerHTML = html;
    else {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      document.body.insertBefore(temp.firstElementChild, document.body.firstChild);
    }
  }

  // ============ 5) Dropdown Solutions & selector idioma ============
  function wireMenus(){
    const btn  = document.getElementById('navSolutionsBtn');
    const menu = document.getElementById('navSolutionsMenu');
    const root = document.getElementById('navSolutionsRoot');
    if (btn && menu && !btn.dataset.wired) {
      const open  = () => { menu.classList.remove('hidden'); btn.setAttribute('aria-expanded','true'); };
      const close = () => { menu.classList.add('hidden');  btn.setAttribute('aria-expanded','false'); };
      const toggle= () => (menu.classList.contains('hidden') ? open() : close());
      btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(); });
      btn.addEventListener('mouseenter', open);
      root.addEventListener('mouseleave', ()=> setTimeout(close, 120));
      document.addEventListener('click', (e)=>{ if (!menu.contains(e.target) && e.target !== btn) close(); });
      document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') close(); });
      if (root) root.style.overflow = 'visible';
      btn.dataset.wired = '1';
    }

    // Selector de idioma: preserva ruta
    const langBtn  = document.getElementById('langBtn');
    const langMenu = document.getElementById('langMenu');
    const langRoot = document.getElementById('langRoot');
    if (langBtn && langMenu && !langBtn.dataset.wired){
      const open  = () => langMenu.classList.remove('hidden');
      const close = () => langMenu.classList.add('hidden');
      langBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); langMenu.classList.toggle('hidden'); });
      langRoot.addEventListener('mouseleave', ()=> setTimeout(close, 120));
      document.addEventListener('click', (e)=>{ if (!langMenu.contains(e.target) && e.target!==langBtn) close(); });

      langMenu.querySelectorAll('a[data-lang]').forEach(a=>{
        a.addEventListener('click', (e)=>{
          e.preventDefault();
          const target = a.dataset.lang; // 'en' | 'fr' | 'es'
          const clean = (p)=> p.replace(/^\/(en|fr)(?=\/)/,''); // quita prefijo actual
          const current = clean(location.pathname);
          const prefix = target==='en' ? '/en' : target==='fr' ? '/fr' : '';
          location.href = prefix + current + location.search + location.hash;
        });
      });
      langBtn.dataset.wired = '1';
    }
  }

  // ============ 6) Boot ============
  function boot(){ mountHeader(); wireMenus(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> { boot(); setTimeout(wireMenus,200); setTimeout(wireMenus,800); });
  } else { boot(); setTimeout(wireMenus,200); setTimeout(wireMenus,800); }
})();
</script>
