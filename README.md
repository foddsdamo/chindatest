# 多语言火锅品鉴活动网站 / Multilingual Hotpot Tasting Website

A beautiful, multilingual hotpot base tasting evaluation website supporting Thai, Chinese, and English languages with Google Sheets integration.

## Features

- **Multi-language Support**: Thai (default), Chinese, and English
- **Google Sheets Integration**: Store and retrieve data from Google Sheets
- **Real-time Leaderboard**: Dynamic ranking based on ratings
- **Responsive Design**: Works on all devices
- **Form Validation**: Comprehensive validation for all inputs
- **Thai Phone Number Validation**: Supports 8-12 digit phone numbers

## Setup Instructions

### 1. Google Sheets Setup

1. Create a new Google Spreadsheet
2. Create two sheets:
   - `HotpotBases` with columns: id, name_th, name_zh, name_en, active
   - `Reviews` with columns: id, userName, userPhone, rating, comment, timestamp, hotpotBaseId

3. Enable Google Sheets API:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create credentials (API Key)

4. Make your spreadsheet public or share with your service account

### 2. Google Apps Script (Optional - for writing data)

Create a Google Apps Script to handle POST requests for writing reviews:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addReview') {
      const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getSheetByName('Reviews');
      const review = data.data;
      
      sheet.appendRow([
        review.id,
        review.userName,
        review.userPhone,
        review.rating,
        review.comment,
        review.timestamp,
        review.hotpotBaseId
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

Deploy as a web app and get the URL.

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_url_here
```

### 4. Sample Data

Add sample hotpot bases to your `HotpotBases` sheet:

| id | name_th | name_zh | name_en | active |
|---|---|---|---|---|
| traditional | น้ำซุปแดงแบบดั้งเดิม | 传统红汤锅底 | Traditional Red Soup | TRUE |
| spicy | น้ำซุปมาล่า | 麻辣锅底 | Spicy Mala Soup | TRUE |
| mushroom | น้ำซุปเห็ด | 菌菇锅底 | Mushroom Soup | TRUE |
| tomato | น้ำซุปมะเขือเทศ | 番茄锅底 | Tomato Soup | TRUE |
| clear | น้ำซุปใส | 清汤锅底 | Clear Soup | TRUE |

## Development

```bash
npm install
npm run dev
```

## Features

- **Fallback Support**: If Google Sheets is unavailable, the app falls back to localStorage
- **Real-time Updates**: Leaderboard updates immediately after new reviews
- **Configurable**: Add new hotpot bases through Google Sheets
- **Validation**: Thai phone number validation (8-12 digits)
- **Beautiful UI**: Modern design with smooth animations

## Languages

- **Thai (ไทย)**: Default language
- **Chinese (中文)**: Simplified Chinese
- **English**: International support

The language preference is saved in localStorage and persists across sessions.