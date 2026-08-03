# Connect Google Sheet → Website form

Sheet: [Digrosys Enquiry Form](https://docs.google.com/spreadsheets/d/1s-De81KxJNoYkHuImM91kvkJC8PlcnN6V6ZGft250lY/edit?usp=sharing)

## 1. Install the script (2 minutes)

1. Open the spreadsheet (you must be signed in as the **owner**, not view-only).
2. **Extensions → Apps Script**
3. Paste everything from `scripts/google-sheets-enquiry.gs`
4. Save

## 2. Test

1. In Apps Script, select function **`testAppend`**
2. Click **Run** → Allow permissions
3. Check the sheet — you should see headers + a “Test Lead” row

## 3. Deploy webhook

1. **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. **Deploy** → copy the URL ending in `/exec`

## 4. Connect the website

Create `.env.local` in the project root:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/PASTE_YOUR_ID/exec
```

Restart the dev server:

```bash
npm run dev
```

Submit the contact form — a new row should appear in the sheet.

## Columns

| Timestamp | Name | Company | Phone | Email | Budget | Services | Details | Source |
