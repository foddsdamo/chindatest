import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Google Sheets代理API
app.post('/api/google-sheets-proxy', async (req, res) => {
  try {
    // 你的 Apps Script Web App URL
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwSlgqj4XmcdwKVUSGQ8m-nq5oMUhPwYUMWg0bxOnWHmKM8iamvCRuTZNsjJPhwiXsV8A/exec';

    console.log('📤 转发请求到Google Apps Script:', req.body);

    // 直接转发 body 到 Apps Script
    const googleRes = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await googleRes.text();
    console.log('📥 Google Apps Script响应:', data);
    
    res.status(200).send(data);
  } catch (error) {
    console.error('❌ 代理错误:', error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API服务器运行正常' });
});

// 处理前端路由 - 简化版本
app.get('/', (req, res) => {
  const indexPath = join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('请先运行 npm run build 构建前端应用');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 代理API地址: http://localhost:${PORT}/api/google-sheets-proxy`);
  console.log(`🏥 健康检查: http://localhost:${PORT}/api/health`);
}); 