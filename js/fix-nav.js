/* /js/fix-nav.js — Hotfix universal para el dropdown “Solutions”
   - Soporta menús que usan .hidden o .dropdown/.show
   - Soporta variantes de IDs: solutionsBtn/solutionsMenu y solutionsMenuBtn/solutionsMenu
   - Fallback: detecta por el texto del botón (“Solutions”) dentro del <header>
*/
(function(){
  function isHidden(menu){
    return menu.classList.contains('hidden') ||
           (menu.classList.contains('dropdown') && !menu.classList.contains('show')) ||
           (menu.style.display === 'none');
  }
  function hide(menu){
    if(menu.classList.contains('dropdown')){
      menu.classList.remove('show');
    } else if(menu.classList.contains('hidden')) {
      /* ya oculto */
    } else if(menu.style.display){
      menu.style.display = '';
    } else {
      menu.classList.add('hidden');
    }
  }
  function toggle(menu){
    if(menu.classList.contains('dropdown')){
      menu.classList.toggle('show');
      return;
    }
    if(menu.classList.contains('hidden')){
      menu.classList.remove('hidden');
      return;
    }
    // fallback inline
    menu.style.display = (menu.style.display === 'block') ? '' : 'block';
  }
  function ensureStartHidden(menu){
    if(menu.classList.contains('dropdown')){
      menu.classList.remove('show');
      return;
    }
    if(!menu.classList.contains('hidden') && !menu.style.display){
      menu.classList.add('hidden');
    }
  }
  function wire(btn, menu){
    if(!btn || !menu) return;
    ensureStartHidden(menu);
    btn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); toggle(menu); });
    document.addEventListener('click', (e)=>{ if(!menu.contains(e.target) && e.target!==btn) hide(menu); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hide(menu); });
  }

  function byIds(){
    wire(document.getElementById('solutionsBtn'),     document.getElementById('solutionsMenu'));
    wire(document.getElementById('solutionsMenuBtn'), document.getElementById('solutionsMenu'));
  }
  function byText(){
    const headers = document.querySelectorAll('header');
    headers.forEach(h=>{
      const candidates = h.querySelectorAll('button,a');
      candidates.forEach(b=>{
        if(/^\s*solutions\s*$/i.test(b.textContent||'')){
          const box  = b.closest('.relative') || b.parentElement;
          const menu = box ? (box.querySelector('.dropdown') ||
                              box.querySelector('div[class*="absolute"]') ||
                              box.querySelector('div.menu')) : null;
          if(menu) wire(b, menu);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{ byIds(); byText(); });
})();

