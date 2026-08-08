/**
 * DIGROSYS — Google Sheets enquiry logger
 * Sheet: https://docs.google.com/spreadsheets/d/1s-De81KxJNoYkHuImM91kvkJC8PlcnN6V6ZGft250lY
 *
 * SETUP (do this once in Google Sheets):
 * 1. Open the Digrosys Enquiry Form spreadsheet (link above)
 * 2. Extensions → Apps Script
 * 3. Delete any default code, paste THIS entire file, Save (Ctrl/Cmd+S)
 * 4. Deploy → New deployment
 *    - Select type: Web app
 *    - Description: Digrosys enquiry webhook
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy → Authorize → Allow
 * 6. Copy the Web app URL (ends with /exec)
 * 7. Put it in your project `.env.local`:
 *    GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 * 8. Restart `npm run dev`
 *
 * Tip: Run testAppend() once from the Apps Script editor (Run ▶)
 * to verify headers + a sample row appear in the sheet.
 */

var SHEET_ID = "1s-De81KxJNoYkHuImM91kvkJC8PlcnN6V6ZGft250lY";
var HEADERS = [
  "Timestamp",
  "Name",
  "Company",
  "Phone",
  "Email",
  "Budget",
  "Services",
  "Details",
  "Source",
  "Status",
];

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheets()[0];
}

function ensureHeaders_(sheet) {
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  var empty = !first[0];
  var incomplete = first.join("|") !== HEADERS.join("|");
  if (empty || incomplete) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
}

function appendEnquiry_(data) {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || "",
    data.company || "",
    data.phone || "",
    data.email || "",
    data.budget || "",
    data.services || "",
    data.details || "",
    data.source || "website",
    data.status || "new",
  ]);
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    appendEnquiry_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({
    ok: true,
    service: "DIGROSYS enquiry webhook",
    sheetId: SHEET_ID,
  });
}

/** Run manually once to create headers + a test row */
function testAppend() {
  appendEnquiry_({
    timestamp: new Date().toISOString(),
    name: "Test Lead",
    company: "DIGROSYS",
    phone: "+918910481382",
    email: "digrosys@gmail.com",
    budget: "₹2L – ₹5L",
    services: "Full Growth System",
    details: "Test row from Apps Script — safe to delete.",
    source: "script-test",
    status: "new",
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
