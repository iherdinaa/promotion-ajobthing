function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Fixed Google Sheet details
    const SHEET_ID = '1DRNKYMCWN2MVjrVqzLWrgLBHHyOryaxIXwnE1stYQKc';
    const SHEET_NAME = 'hrday';

    // Open sheet
    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Sheet tab not found with the name: ' + SHEET_NAME);
    }

    const timestamp = new Date();

    // Append row
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

    // =========================
    // 🌐 UPBOX API
    // =========================
    const apiUrl = "https://upboxapi.ajt.my/leads";
    const authHeader = "Basic Y3Jhd2xlcjpwYXNzMTIz";

    // Determine lead source based on hiring timeline
    const isHiring = ["Currently hiring", "Hiring Next Month", "Hiring in 3 months"].includes(data.hiring_timeline);
    const leadSource = isHiring ? "PopUpBanner_hiring" : "PopUpBanner_qualitycontact";

    const upboxPayload = {
      companyName: data.company_name,
      email: data.email,
      phone: data.phone,
      leadSource: leadSource,
      campaign_name: "7.7 Hiring Fiesta",
      meta: {
        hiring_status: data.hiring_timeline,
        hiring_label: data.hiring_timeline,
        headcount: data.headcount,
        form_questions: data.job_platform,
        special_notes: data.special_note
      }
    };

    const options = {
      method: "post",
      headers: {
        "Authorization": authHeader,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify(upboxPayload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    Logger.log("Upbox API Status: " + response.getResponseCode());
    Logger.log("Upbox API Response: " + response.getContentText());

    // Success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully and sent to Upbox'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
