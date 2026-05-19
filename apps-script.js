// This is the Google Apps Script code to deploy as a Web App.
//
// INSTRUCTIONS:
// 1. Go to script.google.com and create a new project.
// 2. Paste this code into Code.gs.
// 3. Go to Project Settings (gear icon) > Script Properties and add:
//    - SHEET_ID (Your Google Sheet ID from the URL)
//    - SHEET_NAME (The name of the tab, e.g., "Sheet1")
// 4. Click "Deploy" > "New deployment"
// 5. Select type: "Web app"
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Copy the Web App URL provided after deployment.
// 9. Add the URL as VITE_APPSCRIPT_URL in your React app's .env file if calling directly from frontend.

function doPost(e) {
  try {
    // We expect the payload to be passed as robust JSON string
    const data = JSON.parse(e.postData.contents);
    
    // Read environmental variables from Script Properties
    const scriptProps = PropertiesService.getScriptProperties();
    
    // We allow overriding from the frontend payload to be flexible
    const sheetId = data.sheetId || scriptProps.getProperty('SHEET_ID');
    const sheetName = data.sheetName || scriptProps.getProperty('SHEET_NAME');
    
    if (!sheetId || !sheetName) {
      throw new Error("Missing SHEET_ID or SHEET_NAME environmental variables.");
    }

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet tab not found with the name: " + sheetName);
    }
    
    const timestamp = new Date();
    
    // Store according to the columns requested:
    // timestamp | company_name | email | phone | ajt_account | hiring_timeline | headcount | job_platform | special_note | utm_source | utm_medium | utm_campaign
    sheet.appendRow([
      timestamp,
      data.companyName || '',
      data.email || '',
      data.phone || '',
      data.hasAccount || '',
      data.hiringTimeline || '',
      data.headcount || '',
      data.jobPlatform || '',
      data.specialNote || '',
      data.utmSource || '',
      data.utmMedium || '',
      data.utmCampaign || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // CORS support
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

function doGet(e) {
  // Handles browser redirects from POST requests and direct visits
  return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Script is running successfully. Use POST to submit data.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
