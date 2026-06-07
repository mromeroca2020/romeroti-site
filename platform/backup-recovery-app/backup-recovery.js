(function () {
  const workflows = {
    validation: {
      title: "Backup Validation Order",
      status: "Validation Order",
      consoleStatus: "Validation order draft",
      consoleMessage:
        "Backup validation order selected. Romanoti will guide the operator through scope review, backup evidence, restore point reality, risks, and owner-ready reporting.",
      steps: [
        ["1. Define business context", "Identify the client, business owner, critical system, backup provider/tool, and reason for the validation order."],
        ["2. Confirm expected protection scope", "Document what should be protected: servers, VMs, databases, folders, applications, files, cloud data, or business services."],
        ["3. Review backup reality", "Verify last successful backup, failed jobs, warning jobs, missing agents, excluded workloads, and visible restore points."],
        ["4. Capture operational evidence", "Collect screenshots, job IDs, timestamps, logs, console exports, provider references, and operator validation notes."],
        ["5. Identify gaps and risks", "Flag missing evidence, outdated restore points, untested restores, unclear ownership, retention gaps, or critical systems not covered."],
        ["6. Prepare owner-ready result", "Generate a clear summary showing what was verified, what is reliable, what is pending, and what action is required."]
      ]
    },

    restore: {
      title: "Restore Test Order",
      status: "Restore Test",
      consoleStatus: "Restore test draft",
      consoleMessage:
        "Restore test order selected. Romanoti will guide the operator through recovery point selection, restore evidence, validation result, and closure notes.",
      steps: [
        ["1. Capture restore purpose", "Record requester, business reason, urgency, system affected, and what needs to be restored or tested."],
        ["2. Select recovery point", "Confirm the desired date/time, available restore points, retention limits, and whether the selected point is usable."],
        ["3. Execute controlled restore test", "Document whether the restore was performed as a file, folder, VM, database, application object, or controlled test sample."],
        ["4. Validate restored data", "Confirm whether the restored item opens, matches expectations, is usable, and was accepted by the requester or business owner."],
        ["5. Capture restore evidence", "Collect screenshots, restore job references, timestamps, logs, operator comments, validation notes, and any failed attempt details."],
        ["6. Generate closure and follow-up", "Produce closure notes showing what was restored, what evidence exists, what risks remain, and what actions are recommended."]
      ]
    },

    routine: {
      title: "Routine Backup Evidence Review",
      status: "Routine Review",
      consoleStatus: "Routine review draft",
      consoleMessage:
        "Routine evidence review selected. Romanoti will help organize a weekly, monthly, or quarterly validation routine around backup evidence and continuity readiness.",
      steps: [
        ["1. Select review period", "Define whether this is a weekly check, monthly evidence review, quarterly restore validation, or critical system review."],
        ["2. List systems to review", "Identify priority systems, owners, backup tools, provider contacts, expected backup frequency, and business criticality."],
        ["3. Review evidence package", "Collect backup reports, screenshots, logs, CSV/PDF exports, ticket notes, email confirmations, and provider statements."],
        ["4. Score evidence quality", "Classify evidence as strong, partial, missing, outdated, unclear, or requiring restore validation."],
        ["5. Record risks and pending items", "Document failed jobs, missing reports, old restore points, untested recovery, unclear responsibility, or unresolved provider questions."],
        ["6. Produce continuity summary", "Prepare a management-friendly report with validation status, confidence level, evidence quality, risks, and next validation date."]
      ]
    }
  };

  const formSchemas = {
    validation: {
      title: "Backup Validation Order Draft",
      mode: "Validation",
      fields: [
        ["clientName", "Client / Company", "input", "Example: Demo Company Inc."],
        ["businessOwner", "Business Owner / Manager", "input", "Example: Operations Manager"],
        ["systemService", "System / Service Reviewed", "input", "Example: File Server, ERP, Database, VM"],
        ["backupTool", "Backup Tool / Provider", "input", "Example: Veeam, Acronis, MSP Portal, Azure Backup"],
        ["evidenceSource", "Evidence Source", "select", ["Backup console", "Provider report", "MSP portal", "Cloud console", "CSV/PDF export", "Screenshot", "Log file", "Email confirmation", "Not provided"]],
        ["evidenceDate", "Evidence Date", "input", "Example: 2026-06-07"],
        ["lastSuccessfulBackup", "Last Successful Backup", "input", "Date/time or job reference"],
        ["failedJobsFound", "Failed Jobs Found", "select", ["No failed jobs found", "Failed jobs found", "Warnings found", "Not reviewed", "Pending provider confirmation"]],
        ["expectedScope", "Expected Protection Scope", "textarea", "What should be protected?"],
        ["backupReality", "Backup Reality Status", "select", ["Recent successful backup visible", "Backup visible with warnings", "Failed backup detected", "No evidence provided", "Pending review"]],
        ["restorePoint", "Restore Point Status", "select", ["Restore point confirmed", "Restore point old", "Restore point unclear", "No restore point evidence", "Pending restore test"]],
        ["restoreTestPerformed", "Restore Test Performed", "select", ["Yes - successful", "Yes - failed", "Partial test", "Not performed", "Required next"]],
        ["evidenceStatus", "Evidence Status", "select", ["Strong evidence", "Partial evidence", "Missing evidence", "Outdated evidence", "Needs provider confirmation"]],
        ["romanotiValidationStatus", "Romanoti Validation Status", "select", ["Verified", "Verified with warnings", "Pending evidence", "Failed validation", "Restore test required", "Critical risk"]],
        ["riskLevel", "Risk Level", "select", ["Low", "Medium", "High", "Critical", "Pending classification"]],
        ["recommendedAction", "Recommended Action", "textarea", "What should happen next?"],
        ["ownerSummary", "Owner / Management Summary", "textarea", "Simple explanation for the business owner."],
        ["technicalNotes", "Technical Notes", "textarea", "Technical details, references, job IDs, logs, observations."]
      ]
    },

    restore: {
      title: "Restore Test Order Draft",
      mode: "Restore Test",
      fields: [
        ["clientName", "Client / Company", "input", "Example: Demo Company Inc."],
        ["requester", "Requester / Business Contact", "input", "Who requested or approved the restore test?"],
        ["targetSystem", "Restore Target", "input", "File, folder, VM, database, application, service"],
        ["backupTool", "Backup Tool / Provider", "input", "Example: Veeam, Acronis, MSP Portal, Azure Backup"],
        ["recoveryPoint", "Recovery Point Tested", "input", "Date/time or restore point reference"],
        ["evidenceSource", "Evidence Source", "select", ["Backup console", "Provider report", "MSP portal", "Cloud console", "CSV/PDF export", "Screenshot", "Log file", "Email confirmation", "Not provided"]],
        ["evidenceDate", "Evidence Date", "input", "Example: 2026-06-07"],
        ["restoreMethod", "Restore Method", "select", ["File restore", "Folder restore", "VM restore", "Database restore", "Application object restore", "Controlled sample restore"]],
        ["restoreResult", "Restore Test Result", "select", ["Successful and validated", "Successful but not validated", "Failed", "Partially successful", "Pending execution"]],
        ["dataValidated", "Restored Data Reality", "select", ["Opened and confirmed", "Restored but not opened", "Requester confirmed", "Validation pending", "Not usable"]],
        ["romanotiValidationStatus", "Romanoti Validation Status", "select", ["Verified", "Verified with warnings", "Pending evidence", "Failed validation", "Restore test required", "Critical risk"]],
        ["evidenceStatus", "Evidence Status", "select", ["Strong evidence", "Partial evidence", "Missing evidence", "Outdated evidence", "Needs provider confirmation"]],
        ["riskLevel", "Risk Level", "select", ["Low", "Medium", "High", "Critical", "Pending classification"]],
        ["ownerSummary", "Owner / Management Summary", "textarea", "Simple explanation of restore readiness."],
        ["technicalNotes", "Technical Notes", "textarea", "Restore job IDs, timestamps, logs, screenshots, issues."]
      ]
    },

    routine: {
      title: "Routine Evidence Review Draft",
      mode: "Routine Review",
      fields: [
        ["clientName", "Client / Company", "input", "Example: Demo Company Inc."],
        ["reviewPeriod", "Review Period", "select", ["Weekly backup check", "Monthly evidence review", "Quarterly restore validation", "Critical system review", "Custom review"]],
        ["businessOwner", "Business Owner / Manager", "input", "Example: General Manager, Owner, Operations Lead"],
        ["systemsReviewed", "Systems Reviewed", "textarea", "List systems, services, VMs, databases, folders or apps reviewed."],
        ["backupTool", "Backup Tools / Providers", "input", "Example: Veeam, Datto, Acronis, Azure Backup, MSP"],
        ["evidenceSource", "Evidence Package Source", "select", ["Backup console", "Provider report", "MSP portal", "Cloud console", "CSV/PDF export", "Screenshots", "Logs", "Mixed evidence package", "Not provided"]],
        ["evidenceDate", "Evidence Package Date", "input", "Example: 2026-06-07"],
        ["lastSuccessfulBackup", "Most Recent Successful Backup Found", "input", "Date/time, job reference, or Not confirmed"],
        ["restorePointConfirmed", "Restore Point Confirmed", "select", ["Confirmed", "Old restore point", "Unclear", "Not confirmed", "Restore test required"]],
        ["evidenceQuality", "Evidence Quality", "select", ["Strong", "Acceptable", "Partial", "Weak", "Missing"]],
        ["confidenceLevel", "Continuity Confidence", "select", ["High", "Medium", "Low", "Unknown", "Requires restore test"]],
        ["romanotiValidationStatus", "Romanoti Validation Status", "select", ["Verified", "Verified with warnings", "Pending evidence", "Failed validation", "Restore test required", "Critical risk"]],
        ["pendingItems", "Pending Items / Gaps", "textarea", "What is missing, unclear, risky, or waiting for confirmation?"],
        ["nextValidation", "Next Validation Date", "input", "Example: 2026-07-15"],
        ["recommendedAction", "Recommended Action", "textarea", "Next actions for IT, MSP, provider, owner, or management."],
        ["ownerSummary", "Owner / Management Summary", "textarea", "Business-facing summary."],
        ["technicalNotes", "Technical Notes", "textarea", "Technical references, evidence notes, report IDs, screenshots, logs."]
      ]
    }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function updateConsole(status, message) {
    const consoleBox = document.getElementById("braConsole");

    if (!consoleBox) return;

    const statusLabel = consoleBox.querySelector(".bra-console-header span");
    const messageBox = consoleBox.querySelector("p");

    if (statusLabel) statusLabel.textContent = status;
    if (messageBox) messageBox.textContent = message;
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
            <strong>${escapeHtml(step[0])}</strong>
            <p>${escapeHtml(step[1])}</p>
          </article>
        `;
      })
      .join("");

    panel.hidden = false;
    updateConsole(workflow.consoleStatus, workflow.consoleMessage);
  }

  function buildField(field) {
    const [name, label, type, meta] = field;

    if (type === "select") {
      return `
        <div class="bra-field">
          <label for="${name}">${escapeHtml(label)}</label>
          <select id="${name}" name="${name}">
            ${meta.map(function (option) {
              return `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`;
            }).join("")}
          </select>
        </div>
      `;
    }

    if (type === "textarea") {
      return `
        <div class="bra-field full">
          <label for="${name}">${escapeHtml(label)}</label>
          <textarea id="${name}" name="${name}" placeholder="${escapeHtml(meta)}"></textarea>
        </div>
      `;
    }

    return `
      <div class="bra-field">
        <label for="${name}">${escapeHtml(label)}</label>
        <input id="${name}" name="${name}" placeholder="${escapeHtml(meta)}" />
      </div>
    `;
  }

  function renderOrderForm(workflowKey) {
    const schema = formSchemas[workflowKey];
    const panel = document.getElementById("formPanel");
    const title = document.getElementById("formTitle");
    const mode = document.getElementById("formMode");
    const form = document.getElementById("operationalForm");
    const summary = document.getElementById("draftSummary");

    if (!schema || !panel || !title || !mode || !form) {
      updateConsole("Form error", "The execution order form could not be rendered. Please verify the HTML IDs.");
      return;
    }

    title.textContent = schema.title;
    mode.textContent = schema.mode;

    form.dataset.workflowKey = workflowKey;
    form.innerHTML = `
      ${schema.fields.map(buildField).join("")}

      <div class="bra-form-actions">
        <button type="submit" class="bra-button primary">Generate owner-ready summary</button>
        <button type="button" class="bra-button secondary" id="clearDraftBtn">Clear draft</button>
      </div>
    `;

    if (summary) summary.hidden = true;

    panel.hidden = false;

    const clearBtn = document.getElementById("clearDraftBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        form.reset();
        if (summary) summary.hidden = true;
        updateConsole("Draft cleared", "The execution order draft was cleared.");
      });
    }
  }

  function generateSummary(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const workflowKey = form.dataset.workflowKey;
    const schema = formSchemas[workflowKey];

    if (!schema) return;

    const data = new FormData(form);
    const summary = document.getElementById("draftSummary");
    const content = document.getElementById("summaryContent");

    if (!summary || !content) return;

    const orderId = `BRA-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14)}`;

    const rows = schema.fields.map(function (field) {
      const [name, label] = field;
      const value = data.get(name) || "Not provided";
      return `
        <dt>${escapeHtml(label)}</dt>
        <dd>${escapeHtml(value)}</dd>
      `;
    }).join("");

    content.innerHTML = `
      <dl>
        <dt>Romanoti Order ID</dt>
        <dd>${escapeHtml(orderId)}</dd>

        <dt>Order Type</dt>
        <dd>${escapeHtml(schema.title)}</dd>

        <dt>Generated Status</dt>
        <dd>Draft summary generated locally based on operator-provided evidence. Backend/API storage and attachment review pending.</dd>

        ${rows}
      </dl>
    `;

    summary.hidden = false;

    updateConsole(
      "Summary generated",
      "Owner-ready draft summary generated locally. Next phase: save this execution order through the backend/API and generate exportable reports."
    );
  }

  function openWorkspace(workflowKey) {
    renderWorkflow(workflowKey);
    renderOrderForm(workflowKey);

    const formPanel = document.getElementById("formPanel");
    if (formPanel) {
      formPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function initializeBackupRecoveryAssistant() {
    if (!window.RomanotiBackupRecoveryAuth || !window.RomanotiBackupRecoveryAuth.isAuthenticated()) {
      window.location.href = "../backup-recovery-login.html";
      return;
    }

    const config = window.ROMANOTI_BACKUP_RECOVERY_CONFIG || {};
    const validationBtn = document.getElementById("startAssessmentBtn");
    const restoreBtn = document.getElementById("createRestoreBtn");
    const routineBtn = document.getElementById("createRoutineBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const form = document.getElementById("operationalForm");

    updateConsole(
      "Ready",
      `${config.appName || "Backup & Recovery Assistant"} loaded as a Romanoti execution-order and validation workspace. Backend/API will be connected in a later phase.`
    );

    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        window.RomanotiBackupRecoveryAuth.logout();
        window.location.href = "../backup-recovery-login.html";
      });
    }

    if (validationBtn) {
      validationBtn.addEventListener("click", function () {
        openWorkspace("validation");
      });
    }

    if (restoreBtn) {
      restoreBtn.addEventListener("click", function () {
        openWorkspace("restore");
      });
    }

    if (routineBtn) {
      routineBtn.addEventListener("click", function () {
        openWorkspace("routine");
      });
    }

    if (form) {
      form.addEventListener("submit", generateSummary);
    }
  }

  document.addEventListener("DOMContentLoaded", initializeBackupRecoveryAssistant);
})();

