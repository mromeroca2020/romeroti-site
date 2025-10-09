/* /js/fix-nav.js
   Hotfix robusto y *idempotente* para el menú “Solutions”.
   Soporta variaciones que ya existen en tu sitio:
   - Botones con id: solutionsBtn o solutionsMenuBtn
   - Botones cuyo texto sea “Solutions” (fallback)
   - Menús con: .hidden (Tailwind) o .dropdown/.show (legacy)
   - Múltiples headers y/o menús en la misma página

   Comportamiento:
   - Inicialmente oculta el menú si está visible por CSS/HTML.
   - Toggle con click en el botón.
   - Cierra con click afuera o tecla Escape.
   - Actualiza aria-expanded y aria-controls cuando es posible.
*/

(function () {
  function normText(el) { return (el.textContent || '').trim().toLowerCase(); }

  function isHidden(menu) {
    if (menu.classList.contains('hidden')) return true;
    if (menu.classList.contains('dropdown') && !menu.classList.contains('show')) return true;
    const cs = getComputedStyle(menu);
    return cs.display === 'none' || cs.visibility === 'hidden';
  }

  function hideMenu(menu, btn) {
    if (!menu) return;
    if (menu.classList.contains('dropdown')) menu.classList.remove('show');
    else if (!menu.classList.contains('hidden')) menu.classList.add('hidden');
    else menu.style.display = 'none';

    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function showMenu(menu, btn) {
    if (!menu) return;
    if (menu.classList.contains('dropdown')) menu.classList.add('show');
    else {
      menu.classList.remove('hidden');
      menu.style.display = 'block';
    }
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function toggleMenu(menu, btn) {
    if (!menu) return;
    if (isHidden(menu)) showMenu(menu, btn);
    else hideMenu(menu, btn);
  }

  function ensureStartHidden(menu) {
    // Si está visible al cargar, lo ocultamos para tener un estado controlado
    if (!isHidden(menu)) hideMenu(menu);
  }

  function findMenuForButton(btn) {
    // 1) si hay id clásico
    const direct = document.getElementById('solutionsMenu');
    if (direct && btn.closest('header')?.contains(direct)) return direct;

    // 2) dentro de un contenedor típico (.relative padre del botón)
    const box = btn.closest('.relative') || btn.parentElement || btn.closest('header');
    if (box) {
      // Preferimos elementos con apariencia de dropdown/absolute
      const candidates = box.querySelectorAll(
        '#solutionsMenu, .dropdown, div[class*="absolute"], div[role="menu"], div.menu'
      );
      if (candidates.length) return candidates[0];
    }

    // 3) busca el primer menú plausible dentro del header
    const header = btn.closest('header') || document;
    const fallback = header.querySelector('#solutionsMenu, .dropdown, div[class*="absolute"], div[role="menu"]');
    return fallback || null;
  }

  function wire(btn) {
    const menu = findMenuForButton(btn);
    if (!menu) return;

    // Asegura estado inicial oculto
    ensureStartHidden(menu);

    // Accesibilidad mínima
    if (!btn.id) btn.id = 'solutionsToggle-' + Math.random().toString(36).slice(2, 7);
    if (!menu.id) menu.id = 'solutionsMenu-' + Math.random().toString(36).slice(2, 7);
    btn.setAttribute('aria-controls', menu.id);
    btn.setAttribute('aria-expanded', 'false');

    // Toggle y cierres
    const onClick = (e) => { e.preventDefault(); e.stopPropagation(); toggleMenu(menu, btn); };
    btn.addEventListener('click', onClick);

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn) hideMenu(menu, btn);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideMenu(menu, btn); });
  }

  function wireAll() {
    // 1) por IDs conocidos
    const byId = ['solutionsBtn', 'solutionsMenuBtn']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    // 2) por texto del botón “Solutions” dentro de headers
    const btnsByText = Array.from(document.querySelectorAll('header button, header a'))
      .filter(el => normText(el) === 'solutions');

    // Unificamos y cableamos sin duplicar
    const set = new Set();
    [...byId, ...btnsByText].forEach(b => { if (!set.has(b)) { set.add(b); wire(b); } });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireAll);
  } else {
    wireAll();
  }
})();
