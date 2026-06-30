# Teen Health Screener (Mental Health Focus)

A clinical-grade, offline-first web application for administering standardized mental health screenings (PHQ-2/PHQ-9, GAD-2/GAD-7, and C-SSRS suicide risk workflows) in public school health rooms.

👉 **[Live Demo](https://randallching.github.io/teen-health-screener/)**

> ⚠️ *This application is optimized for iPad/tablet viewports — the physical form factor of a school clinic. For the best experience, open the live demo on a tablet or use your browser's responsive design mode set to an iPad viewport (e.g., 768px wide).*

---

## Background

School health rooms operate under compounding constraints: a single nurse managing multiple students simultaneously, a tight window to conduct screening protocols, and zero-budget infrastructure. The legacy paper-based screening process created administrative backlogs, and PDFs emailed to remote APRNs created PHI transmission risks.

This tool was designed and deployed to replace that process. It runs as a single self-contained HTML file served via Google Apps Script — no server, no database, no build pipeline, no IT budget required.

---

## Why a Single-File Architecture

The application is intentionally delivered as one self-contained `index.html` with all CSS, HTML, and JavaScript inlined. This was a deliberate constraint-driven decision, not a shortcut:

- **Deployment target:** Shared school iPads managed by district IT where installing Node.js, running build tools, or accessing external CDNs is not permitted.
- **Zero maintenance overhead:** The entire app is updated by replacing one file in Google Apps Script. No package manager, no build step, no dependency drift.
- **Firewall compliance:** School district networks block many external CDN domains. Inlining everything guarantees the app loads in any restricted environment.
- **Offline resilience:** Once the Apps Script URL is loaded, the client-side app has no further network dependency. Screenings can proceed through intermittent connectivity.

---

## Architecture

```
┌───────────────────────────────────────────────────────────┐
│  DEPLOYMENT LAYER                                         │
│  Google Apps Script (doGet() → serves index.html)        │
│  Audit log: Session.getActiveUser() → Execution Logs     │
└───────────────────────────┬───────────────────────────────┘
                            │  HTTPS (district-authorized URL)
┌───────────────────────────▼───────────────────────────────┐
│  CLIENT LAYER  (school iPad / Safari)                     │
│                                                           │
│  ┌─────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  Session    │  │  Screening       │  │  Staff      │  │
│  │  Init Gate  │→ │  Engine          │→ │  Review     │  │
│  │  (Nurse)    │  │  (Student)       │  │  Dashboard  │  │
│  └─────────────┘  └──────────────────┘  └──────┬──────┘  │
│                                                 │         │
│                                    ┌────────────▼──────┐  │
│                                    │  C-SSRS Module    │  │
│                                    │  (Nurse-gated)    │  │
│                                    └────────────┬──────┘  │
└─────────────────────────────────────────────────┼─────────┘
                                                  │ mailto: (E Secure prefix)
                                    ┌─────────────▼──────────┐
                                    │  Enterprise Mail       │
                                    │  Gateway (encryption   │
                                    │  trigger on E Secure)  │
                                    └────────────────────────┘
```

**Data never touches a server.** All screening responses live exclusively in browser RAM for the duration of the session. The email trigger (`E Secure` subject prefix) routes the encrypted report to the remote APRN's charting inbox.

---

## Validated Screening Instruments

| Instrument | Questions | Score Range | Domain |
|---|---|---|---|
| PHQ-2 | Q1–Q2 | 0–6 | Depression screener (gateway) |
| PHQ-9 | Q1–Q9 | 0–27 | Full depression severity |
| GAD-2 | Q1–Q2 | 0–6 | Anxiety screener (gateway) |
| GAD-7 | Q1–Q7 | 0–21 | Full anxiety severity |
| C-SSRS | Q1–Q7 | Risk tier | Suicide ideation / intent / history |

### PHQ-9 Severity Thresholds

| Score | Severity |
|---|---|
| 0–4 | Minimal |
| 5–9 | Mild |
| 10–14 | Moderate |
| 15–19 | Moderately Severe |
| 20–27 | Severe |

### GAD-7 Severity Thresholds

| Score | Severity |
|---|---|
| 0–4 | Minimal |
| 5–9 | Mild |
| 10–14 | Moderate |
| 15–21 | Severe |

### C-SSRS Branching Logic

The C-SSRS module is gated behind a nurse confirmation step and is automatically flagged as urgent (pulsing red border) when PHQ-9 Q9 > 0.

- **Q2 = Yes** → Sub-questions 3–5 dynamically reveal (intent and plan)
- **Q6 = Yes** → Q7 reveals (past attempt within 3 months)
- Each question produces an inline risk alert (Low / Moderate / High) with immediate action recommendations

---

## Clinical Security Features

The application encodes several deliberate security behaviors to protect student PHI on shared hardware:

| Feature | Implementation |
|---|---|
| Text copy disabled | `user-select: none` on all result areas |
| Ctrl+C / Ctrl+S / Ctrl+P blocked | `keydown` event listener in result section |
| Right-click disabled | `contextmenu` event listener in result section |
| Reload guard during active session | `beforeunload` listener with browser confirmation prompt |
| Student initials only | No full name field; PHI minimized at input layer |
| Email HIPAA gate | Two-step confirmation with PHI notice before `mailto:` fires |
| RAM purge on reset | Explicit variable wipe + UI reset; no disk writes |
| Audit trail | `Session.getActiveUser()` logged to Apps Script Execution Logs on each `doGet()` |

---

## Clinical Workflow Summary

A full step-by-step SOP is in [STANDARD_OPERATING_PROCEDURE.md](STANDARD_OPERATING_PROCEDURE.md). The high-level flow:

1. **Nurse initializes** session (date + student initials), confirms gate, hands iPad to student.
2. **Student self-administers** PHQ-4, GAD-7, PHQ-9, and two additional questions, then taps *I'm Done*.
3. **Student overlay** (green) instructs student to return the tablet.
4. **Nurse overlay** (clinical gray) shows any unanswered questions and gates access to results.
5. **Nurse reviews** scores on the dashboard. If PHQ-9 Q9 > 0, the C-SSRS button pulses red.
6. **Nurse administers C-SSRS** verbally if indicated. Risk tiers generate inline action recommendations.
7. **Nurse taps "Generate Email Report"** → HIPAA acknowledgment gate → `mailto:` fires with `E Secure` subject prefix → iOS Mail opens with pre-populated body.
8. **Nurse enters** the secure APRN recipient email, taps Send.
9. **Nurse performs RAM purge** (Clear & Start New Student or hard reload).

---

## Deployment (Google Apps Script)

1. Create a new project in the [Google Apps Script Console](https://script.google.com/).
2. In `Code.gs`, paste the contents of `apps_script/Code.gs` from this repository.
3. Create an HTML file named `index.html` in the project and paste the contents of `index.html`.
4. Click **Deploy → New Deployment → Web App**.
   - Execute as: *User accessing the web app*
   - Who has access: *Anyone within your organization*
5. Copy the generated URL and distribute to clinical endpoints.

For full setup, access control, and update procedures, see [STANDARD_OPERATING_PROCEDURE.md](STANDARD_OPERATING_PROCEDURE.md).

---

## Security Model

See [SECURITY.md](SECURITY.md) for the complete data handling policy.

**Summary:**
- Zero server-side storage. All responses exist only in volatile browser RAM.
- No disk writes. No local storage. No cookies. No external network calls post-load.
- PHI-minimized input layer (initials only).
- Email transmission encrypted via enterprise mail gateway (`E Secure` subject prefix).
- Access audit via Google Apps Script Execution Logs.

---

## License

MIT — Copyright (c) 2026 Randall Ching
