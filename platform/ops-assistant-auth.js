/*
  FILE: /platform/ops-assistant-auth.js
  PURPOSE:
  Simple local/demo authentication helper for Romanoti Ops Assistant.

  IMPORTANT:
  This is a front-end pilot access gate, useful for internal demo flow and
  visual consistency with Romanoti Platform. It is not production-grade security.
*/

(function () {
  const SESSION_KEY = "romanoti_ops_assistant_session_v1";
  const USER_KEY = "romanoti_ops_assistant_user_v1";

  const USERS = [
    {
      username: "mauricio",
      password: "OpsAssistant2026!",
      name: "Mauricio Romero",
      role: "Romanoti Admin",
      initials: "MR"
    },
    {
      username: "ops",
      password: "RomanotiOps2026!",
      name: "Ops Assistant",
      role: "Romanoti Operator",
      initials: "OA"
    }
  ];

  function normalize(value) {
    return String(value || "").trim();
  }

  function login(username, password) {
    const cleanUser = normalize(username).toLowerCase();
    const cleanPass = normalize(password);

    const user = USERS.find(
      (item) => item.username.toLowerCase() === cleanUser && item.password === cleanPass
    );

    if (!user) {
      return {
        ok: false,
        message: "Invalid Ops Assistant credentials."
      };
    }

    localStorage.setItem(SESSION_KEY, "active");
    localStorage.setItem(USER_KEY, JSON.stringify({
      username: user.username,
      name: user.name,
      role: user.role,
      initials: user.initials
    }));

    return {
      ok: true,
      user
    };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function isAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === "active";
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  window.RomanotiOpsAssistantAuth = {
    SESSION_KEY,
    USER_KEY,
    login,
    logout,
    isAuthenticated,
    getUser
  };
})();
