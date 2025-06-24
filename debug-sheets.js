// Google Sheets 诊断脚本
const GOOGLE_SHEETS_API_KEY = 'AIzaSyBH-EU78R0Goti7u1c9ffDSpZANSfIiLYg';
const SPREADSHEET_ID = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';

async function diagnoseGoogleSheets() {
  console.log('🔍 Google Sheets 诊断报告\n');
  console.log('📋 配置信息:');
  console.log(`   API Key: ${GOOGLE_SHEETS_API_KEY.substring(0, 20)}...`);
  console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`   Spreadsheet URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);

  // 测试1: 检查API密钥是否有效
  console.log('🧪 测试1: API密钥有效性');
  try {
    const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(testUrl);
    
    if (response.ok) {
      console.log('✅ API密钥有效，可以访问表格元数据');
    } else if (response.status === 403) {
      console.log('❌ 403错误 - 权限问题');
      console.log('💡 解决方案:');
      console.log('   1. 确保Google Sheets表格已公开');
      console.log('   2. 检查API密钥是否有Google Sheets API权限');
      console.log('   3. 确保Google Sheets API已启用');
    } else if (response.status === 404) {
      console.log('❌ 404错误 - 表格不存在或ID错误');
    } else {
      console.log(`❌ 其他错误: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ 网络错误:', error.message);
  }

  // 测试2: 尝试读取锅底数据
  console.log('\n🧪 测试2: 读取锅底数据');
  try {
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/HotpotBases?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(basesUrl);
    
    if (response.ok) {
      const data = await response.json();
      const rows = data.values || [];
      console.log(`✅ 成功读取锅底数据，共 ${rows.length} 行`);
      
      if (rows.length > 1) {
        console.log('📋 数据预览:');
        rows.slice(1, 3).forEach((row, index) => {
          console.log(`   行${index + 2}: ${row.join(' | ')}`);
        });
      }
    } else {
      console.log(`❌ 读取失败: ${response.status} ${response.statusText}`);
      if (response.status === 403) {
        console.log('💡 403错误可能原因:');
        console.log('   - 表格未公开');
        console.log('   - API密钥权限不足');
        console.log('   - Google Sheets API未启用');
      }
    }
  } catch (error) {
    console.log('❌ 读取错误:', error.message);
  }

  // 测试3: 尝试读取评价数据
  console.log('\n🧪 测试3: 读取评价数据');
  try {
    const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Reviews?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(reviewsUrl);
    
    if (response.ok) {
      const data = await response.json();
      const rows = data.values || [];
      console.log(`✅ 成功读取评价数据，共 ${rows.length} 行`);
      
      if (rows.length > 1) {
        console.log('📋 数据预览:');
        rows.slice(1, 3).forEach((row, index) => {
          console.log(`   行${index + 2}: ${row.join(' | ')}`);
        });
      }
    } else {
      console.log(`❌ 读取失败: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ 读取错误:', error.message);
  }

  // 测试4: 检查工作表是否存在
  console.log('\n🧪 测试4: 检查工作表');
  try {
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(sheetsUrl);
    
    if (response.ok) {
      const data = await response.json();
      const sheets = data.sheets || [];
      const sheetNames = sheets.map(sheet => sheet.properties.title);
      
      console.log('✅ 表格中的工作表:');
      sheetNames.forEach(name => {
        console.log(`   - ${name}`);
      });
      
      const requiredSheets = ['HotpotBases', 'Reviews'];
      const missingSheets = requiredSheets.filter(name => !sheetNames.includes(name));
      
      if (missingSheets.length > 0) {
        console.log('❌ 缺少必需的工作表:', missingSheets.join(', '));
      } else {
        console.log('✅ 所有必需的工作表都存在');
      }
    } else {
      console.log(`❌ 获取工作表信息失败: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ 检查工作表错误:', error.message);
  }

  console.log('\n📝 诊断完成！');
  console.log('\n🔧 如果遇到403错误，请按以下步骤解决:');
  console.log('1. 打开Google Sheets表格');
  console.log('2. 点击右上角的"共享"按钮');
  console.log('3. 选择"任何人都可以查看"');
  console.log('4. 点击"完成"');
  console.log('5. 重新运行此诊断脚本');
}

diagnoseGoogleSheets(); 