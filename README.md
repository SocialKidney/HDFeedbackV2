# Workflow Pain Point Identifier

## Project Overview
This application is a guided, anonymous feedback tool designed to interview colleagues in a medical setting (specifically hemodialysis units) to identify pain points in their daily workflows. The user provides feedback on specific topics, and an AI generates a summary of their pain points, which can then be submitted anonymously to a Google Sheet.

## Application Flow
1.  **Role Selection:** The user first lands on a welcome screen and selects their professional role (e.g., 'Physician / NP', 'Nursing Staff').
2.  **Site Selection:** The user then selects their work site area and type (e.g., 'AKC North', 'Hospital Unit').
3.  **Home/Topic Selection:** The user is presented with a dashboard of common workflow topics and selects one to provide feedback on.
4.  **Feedback Input:** For each selected topic, the user can type and add multiple distinct points of feedback.
5.  **Summary Generation:** After providing feedback, the user generates an AI summary of their pain points.
6.  **Submission:** The user can anonymously submit the feedback (role, site, summary, transcript) to a Google Sheet.

## Technology Stack & Backend
*   **Frontend:** React, TypeScript, TailwindCSS.
*   **AI Model:** Gemini Pro (via Google Apps Script).
*   **Backend:** The app uses a Google Apps Script Web App as a secure backend proxy.

## Setup
To enable the submission and summarization features, you must set up the Google Apps Script backend. Detailed, step-by-step instructions are located in the `config.ts` file.
