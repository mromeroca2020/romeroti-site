@'
const NETPILOT_SESSION_KEY = "romanoti_netpilot_session_v1";

const NETPILOT_ALLOWED_USERS = [
  {
    username: "netpilot",
    password: "Romanoti2026!"
  },
  {
    username: "mauricio",
    password: "NetPilot2026!"
  }
];

function isAuthenticated() {
  return localStorage.getItem(NETPILOT_SESSION_KEY) === "active";
}

function login(username, password) {
  const cleanUsername = String(username || "").trim();
  const cleanPassword = String(password || "").trim();

  return NETPILOT_ALLOWED_USERS.some(
    (user) => user.username === cleanUsername && user.password === cleanPassword
  );
}

function setSession() {
  localStorage.setItem(NETPILOT_SESSION_KEY, "active");
}

function logout() {
  localStorage.removeItem(NETPILOT_SESSION_KEY);
  window.location.href = "../netpilot-login.html";
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "../netpilot-login.html";
  }
}

window.netpilotAuth = {
  isAuthenticated,
  login,
  setSession,
  logout,
  requireAuth
};
'@ | Set-Content -Encoding UTF8 .\platform\netpilot-auth.js