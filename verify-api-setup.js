// 验证API设置
const GOOGLE_SHEETS_API_KEY = 'AIzaSyBH-EU78R0Goti7u1c9ffDSpZANSfIiLYg';

async function verifyAPISetup() {
  console.log('🔍 验证API设置...\n');

  console.log('📋 检查项目信息:');
  console.log('   项目ID: 5030243920');
  console.log('   API密钥: ' + GOOGLE_SHEETS_API_KEY.substring(0, 20) + '...');
  console.log('   需要启用的API: Google Sheets API\n');

  console.log('🔧 请按以下步骤检查和修复:');
  console.log('');
  console.log('1️⃣ 启用Google Sheets API:');
  console.log('   - 访问: https://console.cloud.google.com/');
  console.log('   - 选择项目: 5030243920');
  console.log('   - 菜单: API和服务 → 库');
  console.log('   - 搜索: "Google Sheets API"');
  console.log('   - 点击: "启用"');
  console.log('');
  
  console.log('2️⃣ 配置API密钥:');
  console.log('   - 菜单: API和服务 → 凭据');
  console.log('   - 找到API密钥并点击编辑');
  console.log('   - API限制: 选择 "Google Sheets API"');
  console.log('   - 应用限制: 选择 "HTTP引用站点" 或 "无"');
  console.log('');
  
  console.log('3️⃣ 检查配额:');
  console.log('   - 菜单: API和服务 → 配额');
  console.log('   - 查看 Google Sheets API 配额使用情况');
  console.log('');
  
  console.log('4️⃣ 验证表格权限:');
  console.log('   - 打开Google Sheets表格');
  console.log('   - 点击右上角 "共享" 按钮');
  console.log('   - 选择 "任何人都可以查看"');
  console.log('');
  
  console.log('✅ 完成以上步骤后，重新运行测试脚本');
  console.log('   node debug-403-error.js');
}

verifyAPISetup(); 