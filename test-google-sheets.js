// 测试Google Sheets API连接
// 使用方法: node test-google-sheets.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取环境变量
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  }
  return {};
}

async function testGoogleSheetsConnection() {
  const env = loadEnv();
  
  console.log('🔍 检查环境变量...');
  console.log('VITE_GOOGLE_SHEETS_API_KEY:', env.VITE_GOOGLE_SHEETS_API_KEY ? '✅ 已设置' : '❌ 未设置');
  console.log('VITE_GOOGLE_SPREADSHEET_ID:', env.VITE_GOOGLE_SPREADSHEET_ID ? '✅ 已设置' : '❌ 未设置');
  console.log('VITE_GOOGLE_APPS_SCRIPT_URL:', env.VITE_GOOGLE_APPS_SCRIPT_URL ? '✅ 已设置' : '❌ 未设置');
  
  if (!env.VITE_GOOGLE_SHEETS_API_KEY || !env.VITE_GOOGLE_SPREADSHEET_ID) {
    console.log('\n❌ 请先设置环境变量！');
    console.log('1. 复制 env.example 为 .env');
    console.log('2. 按照 GOOGLE_SHEETS_SETUP.md 的说明配置Google Sheets');
    return;
  }
  
  console.log('\n🔗 测试Google Sheets API连接...');
  
  try {
    // 测试读取火锅底料数据
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/HotpotBases?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    
    const basesResponse = await fetch(basesUrl);
    
    if (basesResponse.ok) {
      const basesData = await basesResponse.json();
      console.log('✅ 火锅底料数据读取成功');
      console.log(`   找到 ${basesData.values ? basesData.values.length - 1 : 0} 个底料`);
    } else {
      console.log('❌ 火锅底料数据读取失败:', basesResponse.status, basesResponse.statusText);
    }
    
    // 测试读取评价数据
    const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/Reviews?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    
    const reviewsResponse = await fetch(reviewsUrl);
    
    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      console.log('✅ 评价数据读取成功');
      console.log(`   找到 ${reviewsData.values ? reviewsData.values.length - 1 : 0} 条评价`);
    } else {
      console.log('❌ 评价数据读取失败:', reviewsResponse.status, reviewsResponse.statusText);
    }
    
    // 测试Google Apps Script（如果已配置）
    if (env.VITE_GOOGLE_APPS_SCRIPT_URL) {
      console.log('\n🔗 测试Google Apps Script连接...');
      
      try {
        const scriptResponse = await fetch(env.VITE_GOOGLE_APPS_SCRIPT_URL, {
          method: 'GET'
        });
        
        if (scriptResponse.ok) {
          console.log('✅ Google Apps Script连接成功');
        } else {
          console.log('❌ Google Apps Script连接失败:', scriptResponse.status, scriptResponse.statusText);
        }
      } catch (error) {
        console.log('❌ Google Apps Script连接错误:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ API测试失败:', error.message);
  }
  
  console.log('\n📋 下一步：');
  console.log('1. 如果所有测试都通过，运行 npm run dev 启动应用');
  console.log('2. 如果测试失败，请检查 GOOGLE_SHEETS_SETUP.md 中的设置步骤');
  console.log('3. 确保Google Sheets表格已公开或正确共享');
}

// 运行测试
testGoogleSheetsConnection().catch(console.error); 