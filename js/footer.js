/* /js/footer.js
   ============================================================
   Romanoti Solutions - Global footer.js
   ============================================================

   OBJETIVO
   ------------------------------------------------------------
   Footer global con estética más premium y enterprise:
   - fondo más oscuro
   - textura tecnológica sutil
   - navegación limpia
   - CTA visible
   - soporte multilenguaje básico (EN / FR / ES)

   PRINCIPIOS DE ESTA VERSIÓN
   ------------------------------------------------------------
   1) Mejorar contraste y legibilidad
   2) Reducir texto innecesario
   3) Mantener enlaces principales del sitio
   4) Agregar una identidad visual más tecnológica
   5) Evitar imágenes stock o fondos recargados
   6) Mantener compatibilidad con la estructura actual

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
  // Las rutas siguen apuntando a páginas reales existentes.
  // La localización completa por idioma se hará después.
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
  // ------------------------------------------------------------
  // Diseño:
  // - base oscura profunda
  // - overlay con patrón tecnológico sutil hecho con CSS
  // - tres columnas limpias
  // - CTA visible
  // - barra inferior simple
  // ============================================================
  const html = `
  <footer class="relative mt-12 text-gray-300 overflow-hidden border-t border-gray-800">

    <!-- ======================================================
         BACKGROUND BASE
         ====================================================== -->
    <div class="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-slate-950"></div>

    <!-- ======================================================
         TECH GRID OVERLAY
         Patrón sutil generado con CSS, sin imagen externa
         ====================================================== -->
    <div
      class="absolute inset-0 opacity-10"
      style="
        background-image:
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0),
          linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px),
          linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px);
        background-size: 42px 42px, 120px 120px, 120px 120px;
        background-position: center;
      ">
    </div>

    <!-- ======================================================
         SOFT BLUE GLOW
         ====================================================== -->
    <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.20),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_28%)]"></div>

    <!-- ======================================================
         CONTENT
         ====================================================== -->
    <div class="relative container mx-auto px-6 py-12">

      <div class="grid md:grid-cols-3 gap-10">

        <!-- =========================================
             BRAND
             ========================================= -->
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">
            ${I18N.brand}
          </h3>
          <p class="text-sm text-gray-400">
            ${I18N.tagline}
          </p>
        </div>

        <!-- =========================================
             NAVIGATION
             ========================================= -->
        <div>
          <h4 class="text-xs uppercase tracking-wider text-gray-500 mb-3">
            ${I18N.company}
          </h4>

          <nav class="grid grid-cols-2 gap-2 text-sm">
            <a href="${CURRENT.home}" class="hover:text-white transition">${I18N.home}</a>
            <a href="${CURRENT.platform}" class="hover:text-white transition">${I18N.platform}</a>
            <a href="${CURRENT.solutions}" class="hover:text-white transition">${I18N.solutions}</a>
            <a href="${CURRENT.enterprise}" class="hover:text-white transition">${I18N.enterprise}</a>
            <a href="${CURRENT.whyRomanoti}" class="hover:text-white transition">${I18N.whyRomanoti}</a>
            <a href="${CURRENT.contact}" class="hover:text-white transition">${I18N.contact}</a>
          </nav>
        </div>

        <!-- =========================================
             CTA / POSITIONING
             ========================================= -->
        <div>
          <h4 class="text-xs uppercase tracking-wider text-gray-500 mb-3">
            ${I18N.services}
          </h4>

          <p class="text-sm text-gray-400 mb-4 leading-6">
            ${I18N.positioning}
          </p>

          <a href="${CURRENT.booking}"
             class="inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">
            ${I18N.cta}
          </a>
        </div>
      </div>

      <!-- =========================================
           BOTTOM BAR
           ========================================= -->
      <div class="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row md:justify-between text-xs text-gray-500 gap-2">
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
