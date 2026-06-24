# STANDARD_OPERATING_PROCEDURE.md

## End-to-End Clinical Workflow

### 1. Preparation & Setup
1.  **Launch:** Open the iPad and navigate to the School Health Screener folder.
2.  **Select Version:**
    *   **Middle School Screener** (Grades 6-8).
    *   **High School Screener** (Grades 9-12).
3.  **Session Initialization:**
    *   Enter **Date**, **Student Last Name**, and **Student First Name**.
    *   Click **Start Screening**.
    *   **Gate:** Confirm the details in the pop-up prompt.
4.  **Handover:** Pass the iPad to the student.

### 2. Student Administration
1.  **Self-Administered Sections:** Student completes PHQ-9, GAD-7, and Additional Questions.
    *   *(HS Only)* Student completes the Sexual/Reproductive Health module.
2.  **Completion:** The student reaches the **STOP** screen ("Please return tablet to Nurse").
3.  **Retrieval:** Take the device back immediately. Do not allow the student to view the staff section.

### 3. Clinical Review & Risk Assessment
1.  **Unlock Results:**
    *   Click **Staff Review**.
    *   **Gate:** Confirm you have control of the device to reveal scores.
2.  **Analyze Scores:** Review calculated totals and severity for Depression (PHQ) and Anxiety (GAD).
3.  **Safety Alerts:**
    *   **Red Safety Alert:** If PHQ-9 Question 9 is positive (>0), a flashing red alert appears.
    *   **C-SSRS Protocol:** Click the **yellow C-SSRS button** to unlock the suicide risk assessment.
    *   *Procedure:* Read C-SSRS questions verbally to the student and record answers. Logic will guide you through Sub-questions 3-5 (if Q2 is Yes) and Q7 (if Q6 is Yes).

### 4. The Data Transmission Protocol (Strict Compliance)
Once the assessment is complete and scores are reviewed, you must follow this 3-step workflow to securely transmit the results. Because the application runs entirely in local browser memory, **no files are ever saved to the iPad disk**, eliminating the risk of data spills.

#### Step 1: Generate Email Report
1. Click **'Email Results'** (or **'Generate Email Report'**) in the staff review section of the screener interface.
2. The browser will launch the native iOS Mail application and pre-populate the subject line and email body with the confidential session scores (PHQ-9/GAD-7/C-SSRS data).

#### Step 2: Secure Recipient Entry
1. Manually type the secure email address of the Remote APRN or charting nurse in the **To** field (this field is intentionally left blank in the application code to prevent hardcoded credential leaks).
2. Tap **Send** to securely transmit the scores directly to the clinical charting inbox.

#### Step 3: RAM Purge (Volatile Memory Sanitization)
1. Close the iOS Mail client and return to the Safari browser tab.
2. Click **'Clear & Start New Student'** at the bottom of the interface.
3. Confirm the action in the system prompt. This completely flushes all student answers from the browser's volatile memory, securing the device for the next screening session.

### 5. Offline Queueing & Encryption Protocol
To maintain data integrity and security in classrooms or health rooms with intermittent internet connectivity:
*   **Outbox Queuing:** If the iPad is offline when the nurse taps **Send**, iOS Mail will natively hold the outgoing report in the **Outbox** folder. The system will automatically transmit the queued email as soon as a network connection is reestablished.
*   **End-of-Shift Draft Audit:** Before locking the device at the end of each day, nurses must open the native iOS Mail application and verify that the **Outbox** and **Drafts** folders are empty. Any unsent reports must be manually sent or verified.
*   **Enterprise Encryption Trigger:** The application automatically prefixes the subject line with `E Secure` (e.g., `E Secure Screener Results - [Initials]`). This keyword is critical as it triggers the clinical network's mail gateway to apply automatic end-to-end encryption to the outbound email, protecting the student's clinical data during transmission.

### 6. Physical Device Security & Patient Safety
*   **Handoff Supervision:** The nurse must unlock the device and initialize the session before passing the tablet to the student. During self-administration, the nurse should maintain line-of-sight to ensure the student does not attempt to close the application or browse other settings.
*   **Immediate RAM Purge Gating:** The "RAM Purge" (Step 3 of the transmission protocol) must be executed immediately upon retrieving the device. Under no circumstances should the device be left unattended or handed to another student before the session is cleared, as this prevents subsequent users from using the browser's back button to view previous responses.
