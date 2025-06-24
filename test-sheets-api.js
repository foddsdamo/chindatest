// 简单的Google Sheets API测试
const GOOGLE_SHEETS_API_KEY = 'AIzaSyAJLzu7b20NUBgAeQ0ezKDUWCIAyfWe6tk';
const SPREADSHEET_ID = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';

async function testSheetsAPI() {
  console.log('🧪 测试Google Sheets API集成...\n');

  try {
    // 测试锅底数据
    console.log('📊 获取锅底数据...');
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/HotpotBases?key=${GOOGLE_SHEETS_API_KEY}`;
    const basesResponse = await fetch(basesUrl);
    
    if (basesResponse.ok) {
      const basesData = await basesResponse.json();
      const basesRows = basesData.values || [];
      console.log(`✅ 锅底数据: ${basesRows.length} 行`);
      
      if (basesRows.length > 1) {
        console.log('📋 锅底数据预览:');
        basesRows.slice(1, 4).forEach((row, index) => {
          console.log(`   ${index + 1}. ID: ${row[0]}, 中文: ${row[2]}, 激活: ${row[4]}`);
        });
      }
    } else {
      console.log(`❌ 锅底数据获取失败: ${basesResponse.status}`);
    }

    // 测试评价数据
    console.log('\n📊 获取评价数据...');
    const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Reviews?key=${GOOGLE_SHEETS_API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    
    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json();
      const reviewsRows = reviewsData.values || [];
      console.log(`✅ 评价数据: ${reviewsRows.length} 行`);
      
      if (reviewsRows.length > 1) {
        console.log('📋 评价数据预览:');
        reviewsRows.slice(1, 4).forEach((row, index) => {
          console.log(`   ${index + 1}. 用户: ${row[1]}, 评分: ${row[3]}, 锅底ID: ${row[6]}`);
        });
      }
    } else {
      console.log(`❌ 评价数据获取失败: ${reviewsResponse.status}`);
    }

    console.log('\n✅ 测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testSheetsAPI(); 