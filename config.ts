// --- CONFIGURATION: GOOGLE APPS SCRIPT WEB APP ---
// This new, more reliable method uses a Google Apps Script Web App to create an API endpoint
// that your app can send data to directly. This avoids the fragile pre-filled link issues.

// --- ONE-TIME SETUP INSTRUCTIONS ---
// Please follow these steps carefully. This will take about 10 minutes.

/*
1.  **CREATE A GOOGLE SHEET:**
    - Go to https://sheets.new to create a new, blank Google Sheet.
    - Give it a name, for example: "Hemodialysis Feedback Responses".

2.  **OPEN THE SCRIPT EDITOR:**
    - In your new sheet, click on "Extensions" in the top menu, then select "Apps Script".
    - A new tab will open with the script editor. Delete any boilerplate code (like `function myFunction() {}`).

3.  **PASTE THE SCRIPT CODE:**
    - Copy the entire `APPS_SCRIPT_CODE` block from below (the code inside the backticks ``).
    - Paste it into the Apps Script editor.
    - Click the "Save project" icon (it looks like a floppy disk).

4.  **ADD YOUR API KEY SECURELY:**
    - In the left-hand menu of the Apps Script editor, click the "Project Settings" icon (a gear ⚙️).
    - Scroll down to the "Script Properties" section and click "Add script property".
    - **Property:** Enter `API_KEY` (must be exactly this name).
    - **Value:** Paste your Google Gemini API key.
    - Click "Save script properties". Your key is now stored securely on the server.

5.  **DEPLOY THE SCRIPT AS A WEB APP:**
    - At the top right of the Apps Script editor, click the blue "Deploy" button.
    - Select "New deployment".
    - Click the gear icon next to "Select type" and choose "Web app".
    - In the dialog that appears, make the following selections:
        - **Description:** "Feedback Form API" (or anything you like).
        - **Execute as:** "Me".
        - **Who has access:** **"Anyone"**.
          (This is CRITICAL. The app is anonymous, so the script must be accessible to anyone on the internet. It does not grant access to your Google account or the sheet itself, only to this specific script.)
    - Click the "Deploy" button.

6.  **AUTHORIZE THE SCRIPT:**
    - A popup will ask for authorization. Click "Authorize access".
    - Choose your Google account.
    - You will likely see a "Google hasn’t verified this app" warning. This is normal.
    - Click "Advanced", and then click "Go to [Your Project Name] (unsafe)".
    - On the next screen, scroll down and click "Allow" to grant the script permission to write to your spreadsheet and connect to external services (the Gemini API).

7.  **GET YOUR WEB APP URL:**
    - After deploying, you will see a "Deployment successfully created" popup.
    - Copy the **Web app URL**. It will start with `https://script.google.com/macros/s/...`.
    - **This is your unique API endpoint.**

8.  **UPDATE THE CONFIGURATION BELOW:**
    - Paste the Web app URL you just copied into the `googleWebAppUrl` field below, replacing the placeholder text.

9.  **IF YOU UPDATE THE SCRIPT LATER:**
    - Click "Deploy" -> "Manage deployments".
    - Select your deployment, click the pencil icon to "Edit".
    - Choose "New version" from the "Version" dropdown.
    - Click "Deploy". You do not need to copy the URL again.
*/


export const formConfig = {
  // PASTE YOUR DEPLOYED WEB APP URL HERE
  googleWebAppUrl: 'https://script.google.com/macros/s/AKfycbzm2TZEwaskXsVpAfz1IOloJbYMxlnLuTzF0QyavN9L0mOcM2ad5arWhZhhKCjFVee6/exec',
};

// --- END OF CONFIGURATION ---


// --- DO NOT EDIT THE CODE BELOW ---
// This is the code you will paste into the Google Apps Script editor in Step 3.
export const APPS_SCRIPT_CODE = `
const SPREADSHEET_NAME = "Form_Responses";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Route the request based on the 'action' property in the payload
    if (data.action === 'summarize') {
      return handleSummarize(data);
    } else if (data.action === 'submit') {
      return handleSubmit(data);
    } else {
      throw new Error("Invalid action specified.");
    }

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }
}

function handleSummarize(data) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  if (!apiKey) {
    throw new Error("API_KEY is not set in Script Properties. Please follow setup instructions.");
  }
  
  if (!data.transcript || data.transcript.length === 0) {
    return ContentService
      .createTextOutput(JSON.stringify({ summary: "No feedback was provided during the session." }))
      .setMimeType(ContentService.MimeType.JSON)
      .addHeader("Access-Control-Allow-Origin", "*");
  }

  const feedbackForSummary = data.transcript.map(msg => "- " + msg.content).join('\\n');
  
  const prompt = \`Your task is to analyze a list of user-submitted feedback points about workflow issues and extract ONLY the problems and pain points.

- Do NOT suggest solutions, improvements, or next steps.
- Do NOT add any introductory or concluding sentences.
- The output must be a simple, concise bulleted list.
- Each bullet point should directly state a pain point identified by the user in their feedback.

User Feedback:
---
\${feedbackForSummary}
---

Pain Points Identified:\`;

  const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=' + apiKey;
  
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify({
      "contents": [{
        "parts": [{ "text": prompt }]
      }]
    })
  };

  const response = UrlFetchApp.fetch(geminiUrl, options);
  const result = JSON.parse(response.getContentText());
  const summary = result.candidates[0].content.parts[0].text;
  
  return ContentService
    .createTextOutput(JSON.stringify({ summary: summary }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader("Access-Control-Allow-Origin", "*");
}

function handleSubmit(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SPREADSHEET_NAME);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SPREADSHEET_NAME);
    sheet.appendRow(["Timestamp", "Role", "Site Area", "Site Type", "Summary", "Transcript"]);
  }

  var payload = data.payload; // The form data is nested under 'payload'
  var timestamp = new Date();
  var role = payload.role || 'N/A';
  var siteArea = payload.siteArea || 'N/A';
  var siteType = payload.siteType || 'N/A';
  var summary = payload.summary || 'N/A';
  var transcript = payload.transcript || 'N/A';

  sheet.appendRow([timestamp, role, siteArea, siteType, summary, transcript]);

  return ContentService
    .createTextOutput(JSON.stringify({ "result": "success" }))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader("Access-Control-Allow-Origin", "*");
}
`;
