// 测试Google Apps Script写入功能
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

async function testAppsScriptWrite() {
  const env = loadEnv();
  
  console.log('🔍 测试Google Apps Script写入功能...\n');
  
  if (!env.VITE_GOOGLE_APPS_SCRIPT_URL) {
    console.log('❌ Apps Script URL未配置');
    return;
  }
  
  console.log('📋 Apps Script URL:', env.VITE_GOOGLE_APPS_SCRIPT_URL);
  
  // 创建测试数据
  const testReview = {
    id: Date.now().toString(),
    userName: '测试用户',
    userPhone: '0812345678',
    rating: 5,
    comment: '这是一个测试评价',
    timestamp: Date.now(),
    hotpotBaseId: 'traditional'
  };
  
  console.log('\n📝 测试数据:', testReview);
  
  try {
    console.log('\n🔗 发送POST请求到Apps Script...');
    
    const response = await fetch(env.VITE_GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'addReview',
        data: testReview
      })
    });
    
    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.text();
      console.log('✅ 请求成功');
      console.log('📄 响应内容:', result);
      
      try {
        const jsonResult = JSON.parse(result);
        if (jsonResult.success) {
          console.log('🎉 数据写入成功！');
        } else {
          console.log('❌ 数据写入失败:', jsonResult.error);
        }
      } catch (e) {
        console.log('⚠️ 响应不是JSON格式:', result);
      }
    } else {
      console.log('❌ 请求失败');
      const errorText = await response.text();
      console.log('📄 错误响应:', errorText);
    }
    
  } catch (error) {
    console.log('❌ 请求出错:', error.message);
  }
  
  console.log('\n📋 下一步检查:');
  console.log('1. 检查Google Sheets的Reviews工作表是否有新数据');
  console.log('2. 如果失败，请检查Apps Script代码和部署设置');
  console.log('3. 确保Apps Script有写入权限');
}

testAppsScriptWrite().catch(console.error); 