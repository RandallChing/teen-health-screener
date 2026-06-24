# Teen Health Screener - Community Clinic Edition 🏥

An offline-first, client-side HTML/JS web application designed to simplify mental health screenings (PHQ-9, GAD-7, and C-SSRS suicide risk workflows) in public school health rooms.

👉 **[Live Demo](https://randallching.github.io/teen-health-screener/)**

### 🧠 The Problem & Context
School health offices operate under heavy constraints. During busy periods, a single nurse may manage multiple students simultaneously, leaving a narrow window to conduct screening protocols. Legacy paper-based files created administrative backlogs, delaying critical referrals for students in distress.

### 🛠️ Key Features
* **Standalone Web App Deployment:** Served directly via Google Apps Script as a standalone web application. This architecture was explicitly chosen to bypass complex server maintenance overhead, navigate rigid school district firewalls, and run seamlessly on shared school hardware with zero deployment budget.
* **Clinical Severity Scoring:** Encodes branching scoring rules for standard PHQ-4, PHQ-9, and GAD-7 mental health assessments, with active warnings for clinical suicide risk thresholds.
* **Client-Side Privacy:** Processes all student answers locally in browser memory. No data is stored on remote servers, and standard text copying is disabled to protect student health records on shared school iPads.
