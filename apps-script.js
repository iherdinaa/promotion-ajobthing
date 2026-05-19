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
//
// COLUMNS:
// timestamp | company_name | email | phone | ajt_account | hiring_timeline | headcount | job_platform | special_note | utm_source | utm_medium | utm_campaign

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Read environmental variables from Script Properties
    const scriptProps = PropertiesService.getScriptProperties();
    
    // Allow overriding from the frontend payload for flexibility
    const sheetId = data.sheetId || scriptProps.getProperty('SHEET_ID');
    const sheetName = data.sheetName || scriptProps.getProperty('SHEET_NAME');
    
    if (!sheetId || !sheetName) {
      throw new Error("Missing SHEET_ID or SHEET_NAME. Set them in Script Properties.");
    }

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName(sheetName);
    if (!sheet) {
      throw new Error("Sheet tab not found with the name: " + sheetName);
    }
    
    const timestamp = new Date();
    
    // Append row with columns:
    // timestamp | company_name | email | phone | ajt_account | hiring_timeline | headcount | job_platform | special_note | utm_source | utm_medium | utm_campaign
    sheet.appendRow([
      timestamp,
      data.company_name || '',
      data.email || '',
      data.phone || '',
      data.ajt_account || '',
      data.hiring_timeline || '',
      data.headcount || '',
      data.job_platform || '',
      data.special_note || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this in Apps Script to verify your setup
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        company_name: 'Test Company',
        email: 'test@example.com',
        phone: '0123456789',
        ajt_account: 'Yes',
        hiring_timeline: 'hiring now',
        headcount: '1-6',
        job_platform: 'jobstreet',
        special_note: 'HR Day - hiring now - 1-6 - jobstreet - RM200 OFF - GrabGift Chicken Lucky Draw',
        utm_source: 'test',
        utm_medium: 'test',
        utm_campaign: 'test'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
