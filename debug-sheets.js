// 详细调试Google Sheets连接问题
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

async function debugGoogleSheets() {
  const env = loadEnv();
  
  console.log('🔍 详细调试Google Sheets连接...\n');
  
  console.log('📋 环境变量检查:');
  console.log('API Key:', env.VITE_GOOGLE_SHEETS_API_KEY ? '✅ 已设置' : '❌ 未设置');
  console.log('Spreadsheet ID:', env.VITE_GOOGLE_SPREADSHEET_ID ? '✅ 已设置' : '❌ 未设置');
  console.log('Apps Script URL:', env.VITE_GOOGLE_APPS_SCRIPT_URL ? '✅ 已设置' : '❌ 未设置');
  
  if (!env.VITE_GOOGLE_SHEETS_API_KEY || !env.VITE_GOOGLE_SPREADSHEET_ID) {
    console.log('\n❌ 环境变量配置不完整！');
    return;
  }
  
  console.log('\n🔗 测试API连接...');
  
  // 测试1: 检查表格是否存在
  console.log('\n1️⃣ 检查表格是否存在...');
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    const metadataResponse = await fetch(metadataUrl);
    
    if (metadataResponse.ok) {
      const metadata = await metadataResponse.json();
      console.log('✅ 表格存在');
      console.log('   标题:', metadata.properties?.title || '未知');
      console.log('   工作表数量:', metadata.sheets?.length || 0);
      
      if (metadata.sheets) {
        console.log('   工作表列表:');
        metadata.sheets.forEach((sheet, index) => {
          console.log(`     ${index + 1}. ${sheet.properties.title}`);
        });
      }
    } else {
      console.log('❌ 表格不存在或无法访问');
      console.log('   状态码:', metadataResponse.status);
      console.log('   错误信息:', metadataResponse.statusText);
      
      const errorText = await metadataResponse.text();
      console.log('   详细错误:', errorText);
    }
  } catch (error) {
    console.log('❌ 检查表格时出错:', error.message);
  }
  
  // 测试2: 尝试读取HotpotBases工作表
  console.log('\n2️⃣ 测试读取HotpotBases工作表...');
  try {
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/HotpotBases?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    const basesResponse = await fetch(basesUrl);
    
    if (basesResponse.ok) {
      const basesData = await basesResponse.json();
      console.log('✅ HotpotBases工作表读取成功');
      console.log('   数据行数:', basesData.values ? basesData.values.length : 0);
      
      if (basesData.values && basesData.values.length > 0) {
        console.log('   第一行数据:', basesData.values[0]);
        if (basesData.values.length > 1) {
          console.log('   第二行数据:', basesData.values[1]);
        }
      }
    } else {
      console.log('❌ HotpotBases工作表读取失败');
      console.log('   状态码:', basesResponse.status);
      console.log('   错误信息:', basesResponse.statusText);
      
      const errorText = await basesResponse.text();
      console.log('   详细错误:', errorText);
    }
  } catch (error) {
    console.log('❌ 读取HotpotBases时出错:', error.message);
  }
  
  // 测试3: 尝试读取Reviews工作表
  console.log('\n3️⃣ 测试读取Reviews工作表...');
  try {
    const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/Reviews?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    
    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      console.log('✅ Reviews工作表读取成功');
      console.log('   数据行数:', reviewsData.values ? reviewsData.values.length : 0);
      
      if (reviewsData.values && reviewsData.values.length > 0) {
        console.log('   第一行数据:', reviewsData.values[0]);
      }
    } else {
      console.log('❌ Reviews工作表读取失败');
      console.log('   状态码:', reviewsResponse.status);
      console.log('   错误信息:', reviewsResponse.statusText);
      
      const errorText = await reviewsResponse.text();
      console.log('   详细错误:', errorText);
    }
  } catch (error) {
    console.log('❌ 读取Reviews时出错:', error.message);
  }
  
  console.log('\n📋 建议解决方案:');
  console.log('1. 确保Google Sheets表格已设置为"任何人都可以查看"');
  console.log('2. 检查工作表名称是否为"HotpotBases"和"Reviews"（区分大小写）');
  console.log('3. 确保API密钥有正确的权限设置');
  console.log('4. 检查Google Cloud Console中的API配额');
}

debugGoogleSheets().catch(console.error); 