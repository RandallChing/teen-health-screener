# Teen Health Screener - Community Clinic Edition 🏥

An offline-first, client-side HTML/JS web application designed to simplify mental health screenings (PHQ-9, GAD-7, and C-SSRS suicide risk workflows) in public school health rooms.

👉 **[Live Demo](https://randallching.github.io/teen-health-screener/)**  
*(Note: This application was custom-designed for iPad/tablet viewports to fit the physical constraints of clinic rooms. For the best experience, please view this demo on a tablet, a mobile device, or via your browser's responsive design mode set to an iPad viewport.)*

### 🧠 The Problem & Context
School health offices operate under heavy constraints. During busy periods, a single nurse may manage multiple students simultaneously, leaving a narrow window to conduct screening protocols. Legacy paper-based files created administrative backlogs, delaying critical referrals for students in distress.

### 🛠️ Key Features
* **Standalone Web App Deployment:** Served directly via Google Apps Script as a standalone web application. This architecture was explicitly chosen to bypass complex server maintenance overhead, navigate rigid school district firewalls, and run seamlessly on shared school hardware with zero deployment budget.
* **Clinical Severity Scoring:** Encodes branching scoring rules for standard PHQ-4, PHQ-9, and GAD-7 mental health assessments, with active warnings for clinical suicide risk thresholds.
* **Client-Side Privacy:** Processes all student answers locally in browser memory. No data is stored on remote servers, and standard text copying is disabled to protect student health records on shared school iPads.

### 🚀 Google Apps Script Deployment Guide
To deploy this application inside a Google Workspace environment (such as a school district or community health network):
1. Create a new project in the [Google Apps Script Console](https://script.google.com/).
2. Copy the contents of `Code.gs` from this repository into the `Code.gs` file in the Apps Script editor.
3. Create a new HTML file named `index.html` within the Apps Script project and paste the contents of `index.html` from this repository.
4. Click **Deploy > New Deployment**. Choose **Web App**, configure it to run as "User accessing the web app," and set access to "Anyone within your organization."
5. Copy the generated Web App URL to distribute to clinical endpoints or embed securely.
