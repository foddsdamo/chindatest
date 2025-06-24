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

// 测试Google Sheets API集成
const GOOGLE_SHEETS_API_KEY = 'AIzaSyBH-EU78R0Goti7u1c9ffDSpZANSfIiLYg';
const SPREADSHEET_ID = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';

const HOTPOT_BASES_SHEET = 'HotpotBases';
const REVIEWS_SHEET = 'Reviews';

async function testGoogleSheetsAPI() {
  console.log('🧪 开始测试Google Sheets API集成...\n');

  try {
    // 测试锅底数据获取
    console.log('📊 测试获取锅底数据...');
    const basesResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${HOTPOT_BASES_SHEET}?key=${GOOGLE_SHEETS_API_KEY}`
    );
    
    if (!basesResponse.ok) {
      throw new Error(`获取锅底数据失败: ${basesResponse.status} ${basesResponse.statusText}`);
    }
    
    const basesData = await basesResponse.json();
    const basesRows = basesData.values || [];
    
    console.log(`✅ 成功获取锅底数据，共 ${basesRows.length} 行`);
    console.log('📋 锅底数据预览:');
    basesRows.slice(0, 3).forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.join(' | ')}`);
    });

    // 测试评价数据获取
    console.log('\n📊 测试获取评价数据...');
    const reviewsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${REVIEWS_SHEET}?key=${GOOGLE_SHEETS_API_KEY}`
    );
    
    if (!reviewsResponse.ok) {
      throw new Error(`获取评价数据失败: ${reviewsResponse.status} ${reviewsResponse.statusText}`);
    }
    
    const reviewsData = await reviewsResponse.json();
    const reviewsRows = reviewsData.values || [];
    
    console.log(`✅ 成功获取评价数据，共 ${reviewsRows.length} 行`);
    console.log('📋 评价数据预览:');
    reviewsRows.slice(0, 3).forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.join(' | ')}`);
    });

    // 分析数据关联
    console.log('\n🔗 分析数据关联...');
    const validBaseIds = new Set(basesRows.slice(1).map(row => row[0]));
    const validReviews = reviewsRows.slice(1).filter(row => validBaseIds.has(row[6]));
    
    console.log(`✅ 有效锅底ID数量: ${validBaseIds.size}`);
    console.log(`✅ 有效评价数量: ${validReviews.length}`);
    console.log(`❌ 无效评价数量: ${reviewsRows.length - 1 - validReviews.length}`);

    // 计算排行榜数据
    console.log('\n🏆 计算排行榜数据...');
    const baseStats = {};
    
    validReviews.forEach(review => {
      const baseId = review[6];
      if (!baseStats[baseId]) {
        baseStats[baseId] = { ratings: [], total: 0, sum: 0 };
      }
      const rating = parseInt(review[3]) || 0;
      baseStats[baseId].ratings.push(rating);
      baseStats[baseId].total++;
      baseStats[baseId].sum += rating;
    });

    const leaderboard = Object.entries(baseStats)
      .map(([baseId, stats]) => ({
        id: baseId,
        averageRating: stats.total > 0 ? (stats.sum / stats.total).toFixed(1) : '0.0',
        totalRatings: stats.total
      }))
      .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));

    console.log('🏆 排行榜结果:');
    leaderboard.forEach((base, index) => {
      console.log(`   ${index + 1}. ${base.id} - 评分: ${base.averageRating} (${base.totalRatings} 条评价)`);
    });

    console.log('\n✅ Google Sheets API集成测试完成！');
    console.log('📝 建议:');
    console.log('   1. 确保Google Sheets文档已公开或API密钥有访问权限');
    console.log('   2. 检查工作表名称是否正确 (HotpotBases, Reviews)');
    console.log('   3. 验证数据格式是否符合预期');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.log('\n🔧 故障排除建议:');
    console.log('   1. 检查API密钥是否正确');
    console.log('   2. 检查Spreadsheet ID是否正确');
    console.log('   3. 确保Google Sheets API已启用');
    console.log('   4. 检查网络连接');
  }
}

// 运行测试
testGoogleSheetsAPI(); 