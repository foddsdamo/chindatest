// 测试Google Sheets API写入功能
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

async function testGoogleSheetsAPIWrite() {
  const env = loadEnv();
  
  console.log('🔍 测试Google Sheets API写入功能...\n');
  
  if (!env.VITE_GOOGLE_SHEETS_API_KEY || !env.VITE_GOOGLE_SPREADSHEET_ID) {
    console.log('❌ Google Sheets API配置不完整');
    return;
  }
  
  console.log('📋 API Key:', env.VITE_GOOGLE_SHEETS_API_KEY.substring(0, 10) + '...');
  console.log('📋 Spreadsheet ID:', env.VITE_GOOGLE_SPREADSHEET_ID);
  
  // 创建测试数据
  const testReview = {
    id: Date.now().toString(),
    userName: 'API测试用户',
    userPhone: '0812345678',
    rating: 5,
    comment: '这是通过Google Sheets API写入的测试评价',
    timestamp: Date.now(),
    hotpotBaseId: 'traditional'
  };
  
  console.log('\n📝 测试数据:', testReview);
  
  try {
    console.log('\n🔗 发送POST请求到Google Sheets API...');
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/Reviews:append?valueInputOption=RAW&key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          testReview.id,
          testReview.userName,
          testReview.userPhone,
          testReview.rating,
          testReview.comment,
          testReview.timestamp,
          testReview.hotpotBaseId
        ]]
      })
    });
    
    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ 请求成功');
      console.log('📄 响应内容:', JSON.stringify(result, null, 2));
      console.log('🎉 数据写入成功！');
      
      // 验证数据是否真的写入了
      console.log('\n🔍 验证数据写入...');
      const verifyUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/Reviews?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
      const verifyResponse = await fetch(verifyUrl);
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        const rows = verifyData.values || [];
        console.log(`📊 Reviews表总行数: ${rows.length}`);
        
        // 查找刚写入的数据
        const newRow = rows.find(row => row[0] === testReview.id);
        if (newRow) {
          console.log('✅ 验证成功：新数据已写入Google Sheets');
        } else {
          console.log('⚠️ 验证失败：未找到新写入的数据');
        }
      }
      
    } else {
      console.log('❌ 请求失败');
      const errorText = await response.text();
      console.log('📄 错误响应:', errorText);
      
      // 分析错误原因
      if (response.status === 403) {
        console.log('💡 可能的原因：');
        console.log('1. Google Sheets表格没有设置为公开');
        console.log('2. API密钥没有正确的权限');
        console.log('3. 需要启用Google Sheets API');
      } else if (response.status === 404) {
        console.log('💡 可能的原因：');
        console.log('1. 表格ID错误');
        console.log('2. Reviews工作表不存在');
      }
    }
    
  } catch (error) {
    console.log('❌ 请求出错:', error.message);
  }
  
  console.log('\n📋 下一步：');
  console.log('1. 检查Google Sheets的Reviews工作表是否有新数据');
  console.log('2. 如果成功，重启前端应用测试完整功能');
  console.log('3. 如果失败，检查表格权限和API设置');
}

testGoogleSheetsAPIWrite().catch(console.error); 