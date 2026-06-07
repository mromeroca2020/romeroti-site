(function () {
  const SESSION_KEY = "romanoti_backup_recovery_session";

  const allowedUsers = [
    "romanoti",
    "backup",
    "admin",
    "mauricio.romero@romanoti-solutions.com"
  ];

  const pilotPassword = "BackupRecovery2026!";

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function login(username, password) {
    const cleanUsername = normalize(username);

    const validUser = allowedUsers.includes(cleanUsername);
    const validPassword = String(password || "") === pilotPassword;

    if (!validUser || !validPassword) {
      return false;
    }

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        username: cleanUsername,
        module: "backup-recovery",
        authenticatedAt: new Date().toISOString()
      })
    );

    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function isAuthenticated() {
    return Boolean(sessionStorage.getItem(SESSION_KEY));
  }

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch (error) {
      return null;
    }
  }

  window.RomanotiBackupRecoveryAuth = {
    login,
    logout,
    isAuthenticated,
    getSession
  };
})();
