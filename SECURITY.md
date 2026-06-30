# Security & Privacy Architecture

This document describes the data handling policies built into the Teen Health Screener application. It is intended for clinical administrators, district IT security reviewers, and engineers maintaining or extending this system.

---

## Data Classification

This application processes student mental health screening data, which constitutes **Protected Health Information (PHI)** under HIPAA and **student education records** under FERPA.

| Data Element | Classification | Where It Lives |
|---|---|---|
| Student Initials | De-identified identifier | Browser RAM only |
| Screening Date | Session metadata | Browser RAM only |
| PHQ-9 / GAD-7 scores | Clinical encounter data — PHI | Browser RAM only |
| C-SSRS responses | Suicide risk data — highest sensitivity | Browser RAM only |
| Email report body | Compiled PHI narrative | iOS Mail client, enterprise-encrypted |
| Staff access log | Workforce audit data | Google Apps Script Execution Logs |

---

## Zero Server-Side Storage

The application is a single static HTML file served from Google Apps Script. **No screening data is ever transmitted to or stored on any server.**

- No database connections.
- No API calls after the initial page load.
- No `localStorage`, `sessionStorage`, or cookies are used.
- All PHQ-9, GAD-7, and C-SSRS responses exist exclusively in **volatile browser RAM** (JavaScript variables) for the duration of the session.

When the nurse taps **Clear & Start New Student** or performs a browser reload, all variables are explicitly zeroed and the DOM is reset. The data is unrecoverable by subsequent users.

---

## PHI-Minimized Input Layer

The session initialization screen collects:
- **Date** (not student-identifiable alone)
- **Student Initials only** — the full name field was intentionally excluded to limit PHI exposure on shared hardware

No Social Security number, date of birth, medical record number, or full name is ever entered into the application.

---

## Client-Side Copy Protection

To prevent unintentional PHI exposure on shared school iPads, the results dashboard enforces the following protections:

| Protection | Technical Implementation |
|---|---|
| Text selection disabled | `user-select: none` (all vendor prefixes) on entire results section |
| Right-click context menu disabled | `contextmenu` event listener on result section container |
| Ctrl+C / Ctrl+S / Ctrl+P blocked | `keydown` listener; fires alert directing nurse to the email workflow |
| Reload guard during active session | `beforeunload` listener prompts browser confirmation if `isSessionActive === true` |

These controls are soft protections designed to reduce accidental data exposure on shared devices. They do not constitute a cryptographic security boundary.

---

## Email Transmission Protocol

Screening results are transmitted via the native iOS Mail application using a `mailto:` URI. The application:

1. **Pre-populates** the subject line as `E Secure Screener Results - [Initials] - [Date]`.
2. **Pre-populates** the email body with all scoring data.
3. **Leaves the `To:` field blank** — the nurse manually enters the secure APRN recipient address. This prevents hardcoded email addresses from being exposed in the source code.

**Enterprise Encryption Trigger:** The `E Secure` prefix in the subject line activates the clinical network's enterprise mail gateway, which applies automatic end-to-end encryption to the outbound email before delivery.

A two-step HIPAA acknowledgment gate is shown before the `mailto:` fires, confirming the nurse is aware the body contains PHI and will only send to authorized recipients.

---

## Offline Integrity

If the iPad is offline when the nurse taps Send, iOS Mail natively queues the report in the **Outbox** folder and transmits automatically when connectivity is restored.

**End-of-Shift Audit Requirement:** Before locking the device each day, nurses must open iOS Mail and confirm the Outbox and Drafts folders are empty. Any queued reports must be verified as sent. This procedure is documented in [STANDARD_OPERATING_PROCEDURE.md](STANDARD_OPERATING_PROCEDURE.md) § 5.

---

## Access Audit Trail

The Google Apps Script `doGet()` function logs the Google Workspace email address of every user who loads the application:

```javascript
console.log("Screener loaded by: " + Session.getActiveUser().getEmail());
```

This log is available in the Google Apps Script **Execution Log** (View → Executions) and provides a timestamped access audit trail without requiring any external logging infrastructure.

---

## Deployment Access Control

The application is deployed as a Google Apps Script Web App with access restricted to:
- **Who has access:** Anyone within your organization (Google Workspace domain)

This means only users with an active district Google Workspace account can load the application URL. External access is blocked at the Google authentication layer.

---

## Physical Device Security

The application enforces a multi-step handoff protocol to prevent student access to clinical results:

1. **Nurse initializes** the session and verifies session details before handing the iPad to the student.
2. **Student handoff overlay** (green screen): instructs the student to return the tablet before results are revealed.
3. **Nurse handoff overlay** (clinical gray screen): confirms the nurse has physical control of the device before results are displayed.

These overlays are documented in detail in [STANDARD_OPERATING_PROCEDURE.md](STANDARD_OPERATING_PROCEDURE.md) § 2–3.

---

## What This Application Does Not Do

To be explicit for security reviewers:

- ✗ Does not transmit data to any third-party analytics service (no Google Analytics, no tracking pixels).
- ✗ Does not use any external JavaScript CDN (no network dependency post-load).
- ✗ Does not write to `localStorage`, `sessionStorage`, `IndexedDB`, or any browser-persistent storage.
- ✗ Does not store any screening data on Google's servers (Apps Script only serves the static file).
- ✗ Does not hardcode any recipient email addresses, staff credentials, or API keys.

---

## Incident Response

**If a device is lost or stolen during an active session:**
1. The RAM purge is not possible remotely — however, iOS devices lock automatically per district MDM policy.
2. The locked screen prevents browser access. No screening data persists to disk.
3. Notify the district IT security team to remotely wipe the device per MDM policy.

**If the Apps Script URL is accidentally made public:**
1. Revoke the current deployment in Apps Script → Deploy → Manage Deployments → Archive.
2. Create a new deployment with the same settings to generate a new URL.
3. Distribute the new URL to clinical endpoints.
4. External users without district Google Workspace credentials cannot access the application regardless of URL knowledge, due to the org-level access restriction.
