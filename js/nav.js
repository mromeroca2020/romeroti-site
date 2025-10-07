<!-- /js/nav.js -->
<script>
(function () {
  // --- Rutas “fuente de la verdad” ---
  const links = {
    home: "/",
    tools: "/services/tools.html",
    noc: "/it-noc.html",
    soc: "/it-soc.html",
    book: "https://calendly.com/mauricioromeroca",
  };

  const solutions = [
    { label: "Overview",              href: "/solutions/" },
    { label: "CyberShield (MDR)",     href: "/solutions/cybershield/" },
    { label: "SOC Console",           href: "/solutions/cybershield/soc-console.html" },
    { label: "EASM Console",          href: "/solutions/cybershield/easm-console.html" },
    { label: "Field Kit (engineers)", href: "/solutions/cybershield/field-kit/" },
  ];

  // --- Util: detectar página activa (normaliza /index.html) ---
  function isActive(href) {
    const p = window.location.pathname.replace(/\/index\.html$/, "/");
    if (href === "/") return p === "/";
    return p === href || (p.startsWith(href) && href !== "/");
  }

  // --- SVGs inline (para no depender de assets) ---
  const caret = `
    <svg class="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
    </svg>`;
  const burgerIcon = `
    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>`;

  // --- HTML del header (Tailwind) ---
  const headerHTML = `
<header class="bg-white shadow-md sticky top-0 z-50" data-site-header>
  <div class="container mx-auto px-6 py-3">
    <div class="flex items-center justify-between">
      <a href="${links.home}" class="flex items-center font-bold text-xl">
        <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
        RomanoTI Solutions
      </a>

      <button id="nav-burger" class="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Open menu">
        ${burgerIcon}
      </button>

      <nav id="nav-menu" class="hidden md:flex items-center space-x-8">
        <a href="${links.home}" class="${isActive("/") ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}">Home</a>

        <div class="relative group">
          <button id="solutions-btn" class="text-gray-700 hover:text-blue-600 font-medium inline-flex items-center">
            Solutions ${caret}
          </button>
          <div id="solutions-dd" class="hidden absolute group-hover:block left-0 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            ${solutions.map(s => `
              <a href="${s.href}" class="block px-4 py-2 text-sm ${isActive(s.href) ? "text-blue-600 font-semibold" : "text-gray-700"} hover:bg-gray-50">${s.label}</a>
            `).join("")}
          </div>
        </div>

        <a href="${links.tools}" class="${isActive("/services/tools.html") ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}">Tools</a>
        <a href="${links.noc}"   class="${isActive("/it-noc.html")          ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}">NOC</a>
        <a href="${links.soc}"   class="${isActive("/it-soc.html")          ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}">SOC</a>

        <a href="${links.book}" class="btn-primary text-white px-5 py-2 rounded-lg font-medium">Book Now</a>
      </nav>
    </div>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="md:hidden hidden mt-2 border rounded-lg p-2 bg-white">
      <a href="${links.home}" class="block px-3 py-2 ${isActive("/") ? "text-blue-600 font-semibold" : "text-gray-700"}">Home</a>
      <div class="border-t my-2"></div>
      <div class="px-3 py-2 font-medium text-gray-700">Solutions</div>
      ${solutions.map(s => `<a href="${s.href}" class="block px-5 py-2 ${isActive(s.href) ? "text-blue-600 font-semibold" : "text-gray-700"}">• ${s.label}</a>`).join("")}
      <div class="border-t my-2"></div>
      <a href="${links.tools}" class="block px-3 py-2">Tools</a>
      <a href="${links.noc}"   class="block px-3 py-2">NOC</a>
      <a href="${links.soc}"   class="block px-3 py-2">SOC</a>
      <a href="${links.book}"  class="block px-3 py-2 text-white bg-blue-600 rounded-md text-center mt-2">Book Now</a>
    </div>
  </div>
</header>`;

  // --- Montaje: #app-header o lo creamos arriba del body ---
  let mount = document.getElementById("app-header") || document.querySelector("header[data-site-header]");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "app-header";
    document.body.insertBefore(mount, document.body.firstChild);
  }
  mount.innerHTML = headerHTML;

  // --- Comportamiento: burger + dropdown accesible ---
  const burger   = document.getElementById("nav-burger");
  const mobMenu  = document.getElementById("mobile-menu");
  const solBtn   = document.getElementById("solutions-btn");
  const solDrop  = document.getElementById("solutions-dd");

  if (burger && mobMenu) {
    burger.addEventListener("click", () => mobMenu.classList.toggle("hidden"));
  }
  if (solBtn && solDrop) {
    // Click (móvil) abre/cierra
    solBtn.addEventListener("click", (e) => {
      e.preventDefault();
      solDrop.classList.toggle("hidden");
    });
    // Clic fuera cierra
    document.addEventListener("click", (e) => {
      if (!solDrop.contains(e.target) && !solBtn.contains(e.target)) {
        solDrop.classList.add("hidden");
      }
    });
  }
})();
</script>

