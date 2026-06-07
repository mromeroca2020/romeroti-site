(function () {
  const workflows = {
    assessment: {
      title: "Backup assessment workflow",
      status: "Assessment Draft",
      consoleStatus: "Assessment draft",
      consoleMessage:
        "Backup assessment workflow selected. The assistant is preparing a validation path for scope, backup state, evidence, risks, and next actions.",
      steps: [
        ["1. Identify backup scope", "Document protected systems, business owner, backup policy, frequency, retention, and criticality."],
        ["2. Validate last backup state", "Review last successful backup, failed jobs, warning jobs, missing agents, and excluded workloads."],
        ["3. Collect evidence", "Attach screenshots, logs, job IDs, timestamps, validation notes, and operator comments."],
        ["4. Detect operational gaps", "Flag outdated backups, missing validation, unknown recovery points, and continuity risks."],
        ["5. Recommend next actions", "Generate clear follow-up actions for backup owners, infrastructure teams, or Smart Hands support."],
        ["6. Prepare report", "Create a traceable summary for audit, continuity review, client communication, or internal closure."]
      ]
    },

    restore: {
      title: "Restore request workflow",
      status: "Restore Draft",
      consoleStatus: "Restore draft",
      consoleMessage:
        "Restore request workflow selected. The assistant is preparing a restore support path for requester, target system, recovery point, approvals, evidence, and closure notes.",
      steps: [
        ["1. Capture requester details", "Record requester, business unit, urgency, contact method, and reason for restore."],
        ["2. Define restore target", "Identify system, folder, database, VM, file path, application, or service affected."],
        ["3. Confirm recovery point", "Validate desired date/time, available restore points, retention limits, and business impact."],
        ["4. Check approval context", "Document authorization, change requirement, security considerations, and data sensitivity."],
        ["5. Track execution evidence", "Capture restore job status, screenshots, logs, operator notes, and validation results."],
        ["6. Generate closure notes", "Produce professional closure notes with what was restored, evidence collected, and next steps."]
      ]
    }
  };

  function updateConsole(status, message) {
    const consoleBox = document.getElementById("braConsole");

    if (!consoleBox) {
      return;
    }

    const statusLabel = consoleBox.querySelector(".bra-console-header span");
    const messageBox = consoleBox.querySelector("p");

    if (statusLabel) {
      statusLabel.textContent = status;
    }

    if (messageBox) {
      messageBox.textContent = message;
    }
  }

  function renderWorkflow(workflowKey) {
    const workflow = workflows[workflowKey];
    const panel = document.getElementById("workflowPanel");
    const title = document.getElementById("workflowTitle");
    const status = document.getElementById("workflowStatus");
    const stepsContainer = document.getElementById("workflowSteps");

    if (!workflow || !panel || !title || !status || !stepsContainer) {
      updateConsole("Workflow error", "The workflow panel could not be rendered. Please verify the HTML IDs.");
      return;
    }

    title.textContent = workflow.title;
    status.textContent = workflow.status;

    stepsContainer.innerHTML = workflow.steps
      .map(function (step) {
        return `
          <article class="bra-step">
            <strong>${step[0]}</strong>
            <p>${step[1]}</p>
          </article>
        `;
      })
      .join("");

    panel.hidden = false;

    updateConsole(workflow.consoleStatus, workflow.consoleMessage);
  }

  function initializeBackupRecoveryAssistant() {
    if (!window.RomanotiBackupRecoveryAuth || !window.RomanotiBackupRecoveryAuth.isAuthenticated()) {
      window.location.href = "../backup-recovery-login.html";
      return;
    }

    const config = window.ROMANOTI_BACKUP_RECOVERY_CONFIG || {};
    const startAssessmentBtn = document.getElementById("startAssessmentBtn");
    const createRestoreBtn = document.getElementById("createRestoreBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    updateConsole(
      "Ready",
      `${config.appName || "Backup & Recovery Assistant"} loaded in ${config.environment || "local"} mode. Backend/API will be connected in a later phase.`
    );

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        window.RomanotiBackupRecoveryAuth.logout();
        window.location.href = "../backup-recovery-login.html";
      });
    }

    if (startAssessmentBtn) {
      startAssessmentBtn.addEventListener("click", function () {
        renderWorkflow("assessment");
      });
    }

    if (createRestoreBtn) {
      createRestoreBtn.addEventListener("click", function () {
        renderWorkflow("restore");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initializeBackupRecoveryAssistant);
})();

