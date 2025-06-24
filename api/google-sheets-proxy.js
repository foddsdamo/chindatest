export default async function handler(req, res) {
  // 允许所有跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // 你的 Apps Script Web App URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwSlgqj4XmcdwKVUSGQ8m-nq5oMUhPwYUMWg0bxOnWHmKM8iamvCRuTZNsjJPhwiXsV8A/exec';

    // 直接转发 body 到 Apps Script
    const googleRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await googleRes.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.toString() });
  }
} 