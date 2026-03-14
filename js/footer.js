/* /js/footer.js  (JS puro: NO pongas <script> aquí) */
(function () {
  // ============================================================
  // Romanoti Solutions - Global footer.js
  // ============================================================
  //
  // OBJETIVO
  // ------------------------------------------------------------
  // Footer global alineado con el branding actual de Romanoti,
  // con soporte multilenguaje y enlaces coherentes con la nueva
  // arquitectura real del sitio.
  //
  // CHANGE #83
  // ------------------------------------------------------------
  // Se actualizan rutas y enlaces para alinearlos con la
  // estructura actual del repositorio:
  //
  // /
  // /platform/index.html
  // /solutions/index.html
  // /enterprise/government-business.html
  // /why-romanoti.html
  // /contact.html
  // /services/tools.html
  //
  // Se conserva la lógica general del footer actual.
  // ============================================================

  const path = window.location.pathname || '/';

  let lang = 'en';
  if (path === '/fr' || path.startsWith('/fr/')) {
    lang = 'fr';
  } else if (path === '/es' || path.startsWith('/es/')) {
    lang = 'es';
  } else if (path === '/en' || path.startsWith('/en/')) {
    lang = 'en';
  }

  // ============================================================
  // TEXTOS POR IDIOMA
  // ============================================================
  const I18N_MAP = {
    en: {
      brand: 'Romanoti Solutions',
      tagline: 'Infrastructure • Intelligent Technology',
      rights: 'All rights reserved.',
      home: 'Home',
      platform: 'Platform',
      solutions: 'Solutions',
      enterprise: 'Enterprise',
      whyRomanoti: 'Why Romanoti',
      tools: 'Tools',
      contact: 'Contact',
      company: 'Company',
      services: 'Services'
    },
    fr: {
      brand: 'Romanoti Solutions',
      tagline: 'Infrastructure • Technologie intelligente',
      rights: 'Tous droits réservés.',
      home: 'Accueil',
      platform: 'Plateforme',
      solutions: 'Solutions',
      enterprise: 'Entreprise',
      whyRomanoti: 'Pourquoi Romanoti',
      tools: 'Outils',
      contact: 'Contact',
      company: 'Entreprise',
      services: 'Services'
    },
    es: {
      brand: 'Romanoti Solutions',
      tagline: 'Infraestructura • Tecnología inteligente',
      rights: 'Todos los derechos reservados.',
      home: 'Inicio',
      platform: 'Plataforma',
      solutions: 'Soluciones',
      enterprise: 'Enterprise',
      whyRomanoti: 'Por qué Romanoti',
      tools: 'Herramientas',
      contact: 'Contacto',
      company: 'Empresa',
      services: 'Servicios'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;

  // ============================================================
  // RUTAS REALES DEL SITIO ACTUAL
  // ------------------------------------------------------------
  // Nota:
  // Varias páginas actuales viven en raíz y no en /en /fr /es.
  // Se apuntan a rutas reales existentes para evitar enlaces rotos.
  // ============================================================
  const ROUTES = {
    en: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      tools: '/services/tools.html',
      contact: '/contact.html'
    },
    fr: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      tools: '/services/tools.html',
      contact: '/contact.html'
    },
    es: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      tools: '/services/tools.html',
      contact: '/contact.html'
    }
  };

  const CURRENT = ROUTES[lang] || ROUTES.en;

  // ============================================================
  // HTML DEL FOOTER
  // ============================================================
  const html = `
  <footer class="bg-gray-950 text-gray-300 border-t border-gray-800 mt-12">
    <div class="container mx-auto px-6 py-10">
      <div class="grid md:grid-cols-3 gap-8">

        <!-- ======================================================
             BLOQUE DE MARCA
             ====================================================== -->
        <div>
          <h3 class="text-xl font-bold text-white mb-2">${I18N.brand}</h3>
          <p class="text-sm text-gray-400 mb-3">${I18N.tagline}</p>
          <p class="text-sm text-gray-500">
            Government &amp; Enterprise Technology Services
          </p>
        </div>

        <!-- ======================================================
             QUICK LINKS
             ====================================================== -->
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-white mb-3">${I18N.company}</h4>
          <nav class="flex flex-col gap-2 text-sm">
            <a href="${CURRENT.home}" class="hover:text-blue-400">${I18N.home}</a>
            <a href="${CURRENT.platform}" class="hover:text-blue-400">${I18N.platform}</a>
            <a href="${CURRENT.solutions}" class="hover:text-blue-400">${I18N.solutions}</a>
            <a href="${CURRENT.enterprise}" class="hover:text-blue-400">${I18N.enterprise}</a>
            <a href="${CURRENT.whyRomanoti}" class="hover:text-blue-400">${I18N.whyRomanoti}</a>
            <a href="${CURRENT.contact}" class="hover:text-blue-400">${I18N.contact}</a>
          </nav>
        </div>

        <!-- ======================================================
             MENSAJE INSTITUCIONAL
             ====================================================== -->
        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-white mb-3">${I18N.services}</h4>
          <p class="text-sm text-gray-400 leading-6 mb-3">
            Romanoti supports modern organizations with infrastructure visibility,
            operational intelligence, cloud enablement, and cybersecurity-oriented services.
          </p>
          <a href="${CURRENT.tools}" class="text-sm text-blue-400 hover:text-blue-300">
            ${I18N.tools} →
          </a>
        </div>
      </div>

      <!-- ========================================================
           BOTTOM BAR
           ======================================================== -->
      <div class="border-t border-gray-800 mt-8 pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
        <div>&copy; <span id="footerYear"></span> ${I18N.brand} — ${I18N.rights}</div>
        <div class="text-gray-500">Built for secure and scalable digital environments.</div>
      </div>
    </div>
  </footer>`;

  // ============================================================
  // MONTAJE DEL FOOTER
  // ============================================================
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
