// Google Sheets API configuration
const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

// Sheet names
const HOTPOT_BASES_SHEET = 'HotpotBases';
const REVIEWS_SHEET = 'Reviews';

export interface GoogleSheetsHotpotBase {
  id: string;
  name_th: string;
  name_zh: string;
  name_en: string;
  active: boolean;
}

export interface GoogleSheetsReview {
  id: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  timestamp: number;
  hotpotBaseId: string;
}

// Fetch hotpot bases from Google Sheets
export const fetchHotpotBases = async (): Promise<GoogleSheetsHotpotBase[]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${HOTPOT_BASES_SHEET}?key=${GOOGLE_SHEETS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch hotpot bases');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Skip header row
    return rows.slice(1).map((row: string[]) => ({
      id: row[0] || '',
      name_th: row[1] || '',
      name_zh: row[2] || '',
      name_en: row[3] || '',
      active: row[4] === 'TRUE' || row[4] === 'true'
    })).filter((base: GoogleSheetsHotpotBase) => base.active);
  } catch (error) {
    console.error('Error fetching hotpot bases:', error);
    // Return fallback data if Google Sheets is not available
    return [
      { id: 'traditional', name_th: 'น้ำซุปแดงแบบดั้งเดิม', name_zh: '传统红汤锅底', name_en: 'Traditional Red Soup', active: true },
      { id: 'spicy', name_th: 'น้ำซุปมาล่า', name_zh: '麻辣锅底', name_en: 'Spicy Mala Soup', active: true },
      { id: 'mushroom', name_th: 'น้ำซุปเห็ด', name_zh: '菌菇锅底', name_en: 'Mushroom Soup', active: true },
      { id: 'tomato', name_th: 'น้ำซุปมะเขือเทศ', name_zh: '番茄锅底', name_en: 'Tomato Soup', active: true },
      { id: 'clear', name_th: 'น้ำซุปใส', name_zh: '清汤锅底', name_en: 'Clear Soup', active: true }
    ];
  }
};

// Fetch reviews from Google Sheets
export const fetchReviews = async (): Promise<GoogleSheetsReview[]> => {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${REVIEWS_SHEET}?key=${GOOGLE_SHEETS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    
    const data = await response.json();
    const rows = data.values || [];
    
    // Skip header row
    return rows.slice(1).map((row: string[]) => ({
      id: row[0] || '',
      userName: row[1] || '',
      userPhone: row[2] || '',
      rating: parseInt(row[3]) || 0,
      comment: row[4] || '',
      timestamp: parseInt(row[5]) || Date.now(),
      hotpotBaseId: row[6] || ''
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Submit review to Google Sheets ONLY via Vercel/本地代理API
export const submitReview = async (review: GoogleSheetsReview): Promise<boolean> => {
  try {
    // 只请求本地/代理API，避免CORS
    const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;
    if (!GOOGLE_APPS_SCRIPT_URL) {
      console.warn('Google Apps Script URL not configured');
      return false;
    }
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addReview',
        data: review
      })
    });
    if (response.ok) {
      const result = await response.json();
      return result.success || false;
    }
    return false;
  } catch (error) {
    console.error('Error submitting review:', error);
    return false;
  }
};