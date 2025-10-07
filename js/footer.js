<!-- /js/footer.js -->
<script>
(function () {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: "Company",
      items: [
        { label: "About",   href: "/about.html" },
        { label: "Contact", href: "/contact.html" },
        { label: "Book Demo", href: "https://calendly.com/mauricioromeroca" },
      ]
    },
    {
      title: "Services",
      items: [
        { label: "Tools", href: "/services/tools.html" },
        { label: "NOC",   href: "/it-noc.html" },
        { label: "SOC",   href: "/it-soc.html" },
      ]
    },
    {
      title: "Solutions",
      items: [
        { label: "Overview",              href: "/solutions/" },
        { label: "CyberShield (MDR)",     href: "/solutions/cybershield/" },
        { label: "SOC Console",           href: "/solutions/cybershield/soc-console.html" },
        { label: "EASM Console",          href: "/solutions/cybershield/easm-console.html" },
        { label: "Field Kit (engineers)", href: "/solutions/cybershield/field-kit/" },
      ]
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy", href: "/company.html#privacy" },
        { label: "Terms",   href: "/company.html#terms" },
      ]
    }
  ];

  const footerHTML = `
<footer class="bg-gray-900 text-white mt-16" data-site-footer>
  <div class="container mx-auto px-6 py-12">
    <div class="grid md:grid-cols-5 gap-8">
      <!-- Brand / CTA -->
      <div class="md:col-span-2">
        <div class="flex items-center font-bold text-xl mb-3">
          <span class="bg-blue-600 text-white rounded-full w-10 h-10 grid place-items-center mr-3">R</span>
          RomanoTI Solutions
        </div>
        <p class="text-gray-300 text-sm mb-4">
          IT infrastructure, cloud & cybersecurity for SMBs — NOC / SOC / MDR.
        </p>
        <a href="https://calendly.com/mauricioromeroca"
           class="inline-block bg-blue-600 hover:bg-blue-500 transition text-white px-5 py-2 rounded-lg font-medium">
           Book a Call
        </a>
      </div>

      <!-- Link columns -->
      ${sections.map(s => `
        <div>
          <h4 class="font-semibold mb-3">${s.title}</h4>
          <ul class="space-y-2">
            ${s.items.map(i => `
              <li><a class="text-gray-300 hover:text-white" href="${i.href}">${i.label}</a></li>
            `).join("")}
          </ul>
        </div>
      `).join("")}
    </div>

    <div class="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>© ${year} RomanoTI Solutions. All rights reserved.</div>
      <div class="mt-2 md:mt-0">Serving Canada & USA</div>
    </div>
  </div>
</footer>`;

  // Montaje: #app-footer si existe, o al final del <body>
  let mount = document.getElementById("app-footer") || document.querySelector("footer[data-site-footer]");
  if (!mount) {
    mount = document.createElement("div");
    mount.id = "app-footer";
    document.body.appendChild(mount);
  }
  mount.innerHTML = footerHTML;
})();
</script>

