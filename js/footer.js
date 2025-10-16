/* /js/footer.js  (JS puro: NO pongas <script> aquí) */
(function () {
  // 1) HTML del footer. Ajusta el contenido si quieres.
  const html = `
  <footer class="bg-gray-50 border-t border-gray-200 mt-12">
    <div class="container mx-auto px-6 py-8 text-sm text-gray-600">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>&copy; <span id="footerYear"></span> RomanoTI Solutions — All rights reserved.</div>
        <nav class="flex gap-4">
          <a href="/" class="hover:text-blue-600">Home</a>
          <a href="/solutions/" class="hover:text-blue-600">Solutions</a>
          <a href="/services/tools.html" class="hover:text-blue-600">Tools</a>
        </nav>
      </div>
    </div>
  </footer>`;

  // 2) Monta el footer en #app-footer si existe; si no, lo inserta al final del body.
  function mountFooter() {
    let mount = document.getElementById('app-footer');
    if (mount) {
      mount.innerHTML = html;
    } else {
      mount = document.createElement('div');
      mount.id = 'app-footer';
      mount.innerHTML = html;
      document.body.appendChild(mount);
    }
    // Año actual
    const y = mount.querySelector('#footerYear');
    if (y) y.textContent = new Date().getFullYear();
    console.log('[footer] mounted');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
