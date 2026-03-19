/* /js/footer.js
   ============================================================
   Romanoti Solutions - Global footer.js
   ============================================================

   OBJETIVO
   ------------------------------------------------------------
   Footer global limpio, legible, coherente con el branding
   enterprise actual de Romanoti Solutions.

   PRINCIPIOS DE ESTA VERSIÓN
   ------------------------------------------------------------
   1) Mantener soporte multilenguaje básico (EN / FR / ES)
   2) Usar solo rutas reales confirmadas del sitio actual
   3) Reducir ruido visual y texto innecesario
   4) Mejorar jerarquía visual y legibilidad
   5) Incluir un CTA claro y profesional
   6) Mantener un footer consistente en todo el sitio

   CAMBIOS PRINCIPALES
   ------------------------------------------------------------
   - Se simplifica la estructura visual del footer
   - Se eliminan bloques demasiado cargados o poco legibles
   - Se deja una navegación más limpia
   - Se reemplaza el texto largo institucional por una frase
     más corta y clara
   - Se agrega un CTA de consulta
   - Se mejora la barra inferior

   NOTA
   ------------------------------------------------------------
   Este archivo monta dinámicamente el footer dentro de:
     <div id="app-footer"></div>

   Si no existe ese contenedor, lo crea automáticamente.
*/

(function () {
  // ============================================================
  // 1) DETECCIÓN DE IDIOMA DESDE LA URL
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
  // 2) TEXTOS POR IDIOMA
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
      contact: 'Contact',
      company: 'Company',
      services: 'Services',
      cta: 'Book a consultation',
      positioning: 'Structured infrastructure, operational clarity, and enterprise-ready technology services.',
      bottomNote: 'Secure • Scalable • Enterprise-ready'
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
      contact: 'Contact',
      company: 'Entreprise',
      services: 'Services',
      cta: 'Réserver une consultation',
      positioning: 'Infrastructure structurée, clarté opérationnelle et services technologiques prêts pour l’entreprise.',
      bottomNote: 'Sécurisé • Évolutif • Prêt pour l’entreprise'
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
      contact: 'Contacto',
      company: 'Empresa',
      services: 'Servicios',
      cta: 'Agendar consulta',
      positioning: 'Infraestructura estructurada, claridad operativa y servicios tecnológicos listos para entornos empresariales.',
      bottomNote: 'Seguro • Escalable • Enterprise-ready'
    }
  };

  const I18N = I18N_MAP[lang] || I18N_MAP.en;

  // ============================================================
  // 3) RUTAS REALES DEL SITIO ACTUAL
  // ------------------------------------------------------------
  // Nota:
  // Hoy las páginas reales principales siguen viviendo en rutas
  // base y aún no se ha terminado la localización completa.
  // ============================================================
  const ROUTES = {
    en: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html'
    },

    fr: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html'
    },

    es: {
      home: '/',
      platform: '/platform/index.html',
      solutions: '/solutions/index.html',
      enterprise: '/enterprise/government-business.html',
      whyRomanoti: '/why-romanoti.html',
      contact: '/contact.html',
      booking: '/booking.html'
    }
  };

  const CURRENT = ROUTES[lang] || ROUTES.en;

  // ============================================================
  // 4) HTML DEL FOOTER
  // ============================================================
  const html = `
  <footer class="bg-gray-950 text-gray-300 border-t border-gray-800 mt-12">
    <div class="container mx-auto px-6 py-10">

      <div class="grid md:grid-cols-3 gap-8">

        <!-- =========================================
             BRAND
        ========================================== -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">${I18N.brand}</h3>
          <p class="text-sm text-gray-400">${I18N.tagline}</p>
        </div>

        <!-- =========================================
             NAVIGATION
        ========================================== -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            ${I18N.company}
          </h4>

          <nav class="grid grid-cols-2 gap-2 text-sm">
            <a href="${CURRENT.home}" class="hover:text-white">${I18N.home}</a>
            <a href="${CURRENT.platform}" class="hover:text-white">${I18N.platform}</a>
            <a href="${CURRENT.solutions}" class="hover:text-white">${I18N.solutions}</a>
            <a href="${CURRENT.enterprise}" class="hover:text-white">${I18N.enterprise}</a>
            <a href="${CURRENT.whyRomanoti}" class="hover:text-white">${I18N.whyRomanoti}</a>
            <a href="${CURRENT.contact}" class="hover:text-white">${I18N.contact}</a>
          </nav>
        </div>

        <!-- =========================================
             CTA / POSITIONING
        ========================================== -->
        <div>
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            ${I18N.services}
          </h4>

          <p class="text-sm text-gray-400 mb-4">
            ${I18N.positioning}
          </p>

          <a href="${CURRENT.booking}"
             class="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
            ${I18N.cta}
          </a>
        </div>
      </div>

      <!-- =========================================
           BOTTOM BAR
      ========================================== -->
      <div class="border-t border-gray-800 mt-8 pt-5 flex flex-col md:flex-row md:justify-between text-xs text-gray-500 gap-2">
        <div>&copy; <span id="footerYear"></span> ${I18N.brand}. ${I18N.rights}</div>
        <div>${I18N.bottomNote}</div>
      </div>

    </div>
  </footer>`;

  // ============================================================
  // 5) MONTAJE DEL FOOTER
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

  // ============================================================
  // 6) BOOT
  // ============================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();
