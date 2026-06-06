(function () {
  const SESSION_KEY = "romanoti_smart_hands_desk_session";
  const USER_KEY = "romanoti_smart_hands_desk_user";

  const VALID_USERS = [
    { username: "romanoti", password: "SmartHands2026!" },
    { username: "smart", password: "SmartHands2026!" },
    { username: "admin", password: "SmartHands2026!" }
  ];

  function clean(value) {
    return String(value || "").trim();
  }

  function isValidUser(username, password) {
    const user = clean(username).toLowerCase();
    const pass = String(password || "");

    return VALID_USERS.some(function (item) {
      return item.username.toLowerCase() === user && item.password === pass;
    });
  }

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === "active";
  }

  function login(username, password) {
    if (!isValidUser(username, password)) {
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, "active");
    sessionStorage.setItem(USER_KEY, clean(username) || "Romanoti Operator");

    return true;
  }

  function logout(loginPath) {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(USER_KEY);

    window.location.href = loginPath || "../smart-hands-desk-login.html";
  }

  function requireAuth(loginPath) {
    if (!isAuthenticated()) {
      window.location.replace(loginPath || "../smart-hands-desk-login.html");
    }
  }

  function getUser() {
    return sessionStorage.getItem(USER_KEY) || "Romanoti Operator";
  }

  function injectLogoutButton() {
    if (document.getElementById("smartHandsLogoutButton")) return;

    const button = document.createElement("button");
    button.id = "smartHandsLogoutButton";
    button.type = "button";
    button.textContent = "Logout";
    button.style.position = "fixed";
    button.style.right = "22px";
    button.style.bottom = "22px";
    button.style.zIndex = "9999";
    button.style.padding = "11px 16px";
    button.style.borderRadius = "999px";
    button.style.border = "1px solid rgba(148,163,184,.35)";
    button.style.background = "rgba(15,23,42,.94)";
    button.style.color = "white";
    button.style.fontWeight = "800";
    button.style.cursor = "pointer";
    button.style.boxShadow = "0 16px 40px rgba(0,0,0,.35)";

    button.addEventListener("click", function () {
      logout("../smart-hands-desk-login.html");
    });

    document.body.appendChild(button);
  }

  window.RomanotiSmartHandsAuth = {
    login: login,
    logout: logout,
    requireAuth: requireAuth,
    isAuthenticated: isAuthenticated,
    getUser: getUser,
    injectLogoutButton: injectLogoutButton
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("/smart-hands-desk-app/") && isAuthenticated()) {
      injectLogoutButton();
    }
  });
})();
