<script>
(function(){
  const footerHTML = `
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-6 text-center">
      <p>© 2025 RomanoTI Solutions. All rights reserved.</p>
      <p class="mt-2">Serving Canada</p>
    </div>
  </footer>`;
  let mount = document.getElementById('app-footer');
  if(!mount){
    mount = document.createElement('div');
    document.body.appendChild(mount);
  }
  mount.innerHTML = footerHTML;
})();
</script>
