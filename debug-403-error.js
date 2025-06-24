// 详细排查403错误
const GOOGLE_SHEETS_API_KEY = 'AIzaSyAJLzu7b20NUBgAeQ0ezKDUWCIAyfWe6tk';
const SPREADSHEET_ID = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';

async function debug403Error() {
  console.log('🔍 详细排查403错误...\n');

  console.log('📋 配置信息:');
  console.log(`   API Key: ${GOOGLE_SHEETS_API_KEY.substring(0, 20)}...`);
  console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`   Spreadsheet URL: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit\n`);

  // 测试1: 检查API密钥是否有效
  console.log('🧪 测试1: 检查API密钥有效性');
  try {
    const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log('   请求URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log(`   响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API密钥有效，可以访问表格元数据');
      console.log('   表格标题:', data.properties?.title || '未知');
      console.log('   工作表数量:', data.sheets?.length || 0);
    } else if (response.status === 403) {
      console.log('❌ 403错误 - 权限问题');
      const errorText = await response.text();
      console.log('   错误详情:', errorText);
      
      // 分析403错误的具体原因
      if (errorText.includes('API key not valid')) {
        console.log('💡 原因: API密钥无效');
        console.log('   解决方案: 检查API密钥是否正确');
      } else if (errorText.includes('access denied')) {
        console.log('💡 原因: 访问被拒绝');
        console.log('   解决方案: 检查表格权限设置');
      } else if (errorText.includes('quota exceeded')) {
        console.log('💡 原因: API配额超限');
        console.log('   解决方案: 检查Google Cloud Console配额');
      } else {
        console.log('💡 原因: 其他权限问题');
        console.log('   解决方案: 检查Google Sheets和API设置');
      }
    } else {
      console.log(`❌ 其他错误: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ 网络错误:', error.message);
  }

  // 测试2: 检查表格是否存在
  console.log('\n🧪 测试2: 检查表格是否存在');
  try {
    const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(metadataUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 表格存在且可访问');
      console.log('   表格标题:', data.properties?.title || '未知');
      
      if (data.sheets) {
        console.log('   工作表列表:');
        data.sheets.forEach((sheet, index) => {
          console.log(`     ${index + 1}. ${sheet.properties.title}`);
        });
        
        // 检查必需的工作表
        const sheetNames = data.sheets.map(sheet => sheet.properties.title);
        const requiredSheets = ['HotpotBases', 'Reviews'];
        const missingSheets = requiredSheets.filter(name => !sheetNames.includes(name));
        
        if (missingSheets.length > 0) {
          console.log('❌ 缺少必需的工作表:', missingSheets.join(', '));
        } else {
          console.log('✅ 所有必需的工作表都存在');
        }
      }
    } else {
      console.log(`❌ 表格访问失败: ${response.status}`);
      const errorText = await response.text();
      console.log('   错误详情:', errorText);
    }
  } catch (error) {
    console.log('❌ 检查表格时出错:', error.message);
  }

  // 测试3: 检查工作表访问权限
  console.log('\n🧪 测试3: 检查工作表访问权限');
  try {
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/HotpotBases?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log('   测试HotpotBases工作表访问...');
    
    const response = await fetch(basesUrl);
    console.log(`   响应状态: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ HotpotBases工作表可访问');
      console.log(`   数据行数: ${data.values ? data.values.length : 0}`);
    } else {
      const errorText = await response.text();
      console.log('❌ HotpotBases工作表访问失败');
      console.log('   错误详情:', errorText);
    }
  } catch (error) {
    console.log('❌ 测试工作表访问时出错:', error.message);
  }

  // 测试4: 检查API配额
  console.log('\n🧪 测试4: 检查API配额');
  try {
    const quotaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(quotaUrl);
    
    if (response.status === 429) {
      console.log('❌ API配额超限');
      console.log('   解决方案: 等待配额重置或升级API配额');
    } else if (response.status === 403) {
      const errorText = await response.text();
      if (errorText.includes('quota')) {
        console.log('❌ API配额问题');
        console.log('   解决方案: 检查Google Cloud Console中的配额设置');
      }
    } else {
      console.log('✅ API配额正常');
    }
  } catch (error) {
    console.log('❌ 检查配额时出错:', error.message);
  }

  console.log('\n📝 排查完成！');
  console.log('\n🔧 常见403错误解决方案:');
  console.log('1. 检查Google Sheets表格是否设置为"任何人都可以查看"');
  console.log('2. 检查API密钥是否有Google Sheets API权限');
  console.log('3. 检查Google Cloud Console中的API是否已启用');
  console.log('4. 检查API密钥的HTTP引用站点设置');
  console.log('5. 检查表格ID是否正确');
  console.log('6. 检查工作表名称是否正确（区分大小写）');
}

debug403Error(); 