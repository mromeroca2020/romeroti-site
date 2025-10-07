<script>
(function(){
  // Detecta ruta activa
  const path = location.pathname.replace(/\/+$/,'/') || '/';
  const is = (p)=> path === p;
  const starts = (p)=> path.startsWith(p);

  const headerHTML = `
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center font-bold text-xl text-gray-900">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          RomanoTI Solutions
        </a>

        <nav class="hidden md:flex items-center space-x-8">
          <a href="/" class="font-medium ${is('/')?'text-blue-600':'text-gray-700 hover:text-blue-600'}">Home</a>

          <div class="relative">
            <button id="solutionsBtn"
                    class="font-medium inline-flex items-center focus:outline-none ${starts('/solutions/')?'text-blue-600':'text-gray-700 hover:text-blue-600'}"
                    aria-haspopup="true" aria-expanded="false">
              Solutions
              <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.58l3.71-3.35a.75.75 0 111.02 1.1l-4.2 3.79a.75.75 0 01-1.02 0l-4.2-3.79a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
              </svg>
            </button>
            <div id="solutionsMenu"
                 class="hidden absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <a href="/solutions/" class="block px-4 py-2 text-sm ${is('/solutions/')?'text-blue-700 font-semibold bg-gray-50':'text-gray-700 hover:bg-gray-50'}">Overview</a>
              <a href="/solutions/cybershield/" class="block px-4 py-2 text-sm ${starts('/solutions/cybershield/') && !path.includes('soc-console') && !path.includes('easm-console') && !path.includes('field-kit') ? 'text-blue-700 font-semibold bg-gray-50':'text-gray-700 hover:bg-gray-50'}">CyberShield (MDR)</a>
              <a href="/solutions/cybershield/soc-console.html" class="block px-4 py-2 text-sm ${path.includes('soc-console')?'text-blue-700 font-semibold bg-gray-50':'text-gray-700 hover:bg-gray-50'}">SOC Console</a>
              <a href="/solutions/cybershield/easm-console.html" class="block px-4 py-2 text-sm ${path.includes('easm-console')?'text-blue-700 font-semibold bg-gray-50':'text-gray-700 hover:bg-gray-50'}">EASM Console</a>
              <a href="/solutions/cybershield/field-kit/" class="block px-4 py-2 text-sm ${path.includes('field-kit')?'text-blue-700 font-semibold bg-gray-50':'text-gray-700 hover:bg-gray-50'}">Field Kit (engineers)</a>
            </div>
          </div>

          <a href="/services/tools.html" class="font-medium ${starts('/services/')?'text-blue-600':'text-gray-700 hover:text-blue-600'}">Tools</a>
          <a href="/it-noc.html" class="font-medium ${is('/it-noc.html')?'text-blue-600':'text-gray-700 hover:text-blue-600'}">NOC</a>
          <a href="/it-soc.html" class="font-medium ${is('/it-soc.html')?'text-blue-600':'text-gray-700 hover:text-blue-600'}">SOC</a>
          <a href="https://calendly.com/mauricioromeroca" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium">Book Now</a>
        </nav>

        <!-- Atajo móvil mínimo -->
        <div class="md:hidden">
          <a href="/solutions/" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Solutions</a>
        </div>
      </div>
    </div>
  </header>`;

  // Montaje (si no existe el contenedor, lo creo arriba del <body>)
  let mount = document.getElementById('app-header');
  if(!mount){
    mount = document.createElement('div');
    document.body.insertBefore(mount, document.body.firstChild);
  }
  mount.innerHTML = headerHTML;

  // Dropdown accesible
  const btn  = document.getElementById('solutionsBtn');
  const menu = document.getElementById('solutionsMenu');
  if(btn && menu){
    const toggle = () => { menu.classList.toggle('hidden'); btn.setAttribute('aria-expanded', menu.classList.contains('hidden')?'false':'true'); };
    const close  = () => { menu.classList.add('hidden'); btn.setAttribute('aria-expanded','false'); };
    btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(); });
    document.addEventListener('click', (e)=>{ if(!menu.contains(e.target) && e.target!==btn) close(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
  }
})();
</script>
