const { config } = require('dotenv');
const fetch = require('node-fetch');

// 加载环境变量
config();

const env = process.env;

async function debugDataIssues() {
  console.log('🔍 开始调试数据关联问题...\n');
  
  if (!env.VITE_GOOGLE_SHEETS_API_KEY || !env.VITE_GOOGLE_SPREADSHEET_ID) {
    console.log('❌ 缺少必要的环境变量');
    console.log('请确保 .env 文件中包含:');
    console.log('- VITE_GOOGLE_SHEETS_API_KEY');
    console.log('- VITE_GOOGLE_SPREADSHEET_ID');
    return;
  }
  
  try {
    // 1. 读取 HotpotBases 工作表
    console.log('1️⃣ 读取 HotpotBases 工作表...');
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/HotpotBases?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    const basesResponse = await fetch(basesUrl);
    
    if (!basesResponse.ok) {
      console.log('❌ HotpotBases 工作表读取失败:', basesResponse.status, basesResponse.statusText);
      return;
    }
    
    const basesData = await basesResponse.json();
    const basesRows = basesData.values || [];
    
    console.log('✅ HotpotBases 工作表读取成功');
    console.log(`   总行数: ${basesRows.length}`);
    
    if (basesRows.length > 0) {
      console.log('   表头:', basesRows[0]);
      
      // 解析锅底数据
      const hotpotBases = basesRows.slice(1).map(row => ({
        id: row[0] || '',
        name_th: row[1] || '',
        name_zh: row[2] || '',
        name_en: row[3] || '',
        active: row[4] === 'TRUE' || row[4] === 'true'
      }));
      
      const activeBases = hotpotBases.filter(base => base.active);
      const inactiveBases = hotpotBases.filter(base => !base.active);
      
      console.log(`   活跃锅底数量: ${activeBases.length}`);
      console.log(`   非活跃锅底数量: ${inactiveBases.length}`);
      
      if (activeBases.length > 0) {
        console.log('   活跃锅底列表:');
        activeBases.forEach(base => {
          console.log(`     - ${base.id}: ${base.name_zh} (${base.active ? '活跃' : '非活跃'})`);
        });
      }
      
      if (inactiveBases.length > 0) {
        console.log('   非活跃锅底列表:');
        inactiveBases.forEach(base => {
          console.log(`     - ${base.id}: ${base.name_zh} (${base.active ? '活跃' : '非活跃'})`);
        });
      }
    }
    
    // 2. 读取 Reviews 工作表
    console.log('\n2️⃣ 读取 Reviews 工作表...');
    const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.VITE_GOOGLE_SPREADSHEET_ID}/values/Reviews?key=${env.VITE_GOOGLE_SHEETS_API_KEY}`;
    const reviewsResponse = await fetch(reviewsUrl);
    
    if (!reviewsResponse.ok) {
      console.log('❌ Reviews 工作表读取失败:', reviewsResponse.status, reviewsResponse.statusText);
      return;
    }
    
    const reviewsData = await reviewsResponse.json();
    const reviewsRows = reviewsData.values || [];
    
    console.log('✅ Reviews 工作表读取成功');
    console.log(`   总行数: ${reviewsRows.length}`);
    
    if (reviewsRows.length > 0) {
      console.log('   表头:', reviewsRows[0]);
      
      // 解析评价数据
      const reviews = reviewsRows.slice(1).map(row => ({
        id: row[0] || '',
        userName: row[1] || '',
        userPhone: row[2] || '',
        rating: parseInt(row[3]) || 0,
        comment: row[4] || '',
        timestamp: parseInt(row[5]) || Date.now(),
        hotpotBaseId: row[6] || ''
      }));
      
      console.log(`   总评价数量: ${reviews.length}`);
      
      // 统计锅底ID分布
      const baseIdCounts = {};
      reviews.forEach(review => {
        baseIdCounts[review.hotpotBaseId] = (baseIdCounts[review.hotpotBaseId] || 0) + 1;
      });
      
      console.log('   评价中的锅底ID分布:');
      Object.entries(baseIdCounts).forEach(([baseId, count]) => {
        console.log(`     - ${baseId}: ${count} 条评价`);
      });
    }
    
    // 3. 检查数据关联问题
    console.log('\n3️⃣ 检查数据关联问题...');
    
    if (basesRows.length > 1 && reviewsRows.length > 1) {
      const validBaseIds = new Set(
        basesRows.slice(1)
          .filter(row => row[4] === 'TRUE' || row[4] === 'true')
          .map(row => row[0])
      );
      
      const reviewBaseIds = new Set(
        reviewsRows.slice(1)
          .map(row => row[6])
          .filter(id => id && id.trim() !== '')
      );
      
      console.log('✅ 有效的锅底ID:', Array.from(validBaseIds));
      console.log('📊 评价中使用的锅底ID:', Array.from(reviewBaseIds));
      
      // 找出无效的锅底ID
      const invalidBaseIds = Array.from(reviewBaseIds).filter(id => !validBaseIds.has(id));
      
      if (invalidBaseIds.length > 0) {
        console.log('❌ 发现无效的锅底ID:');
        invalidBaseIds.forEach(id => {
          console.log(`     - ${id}: 在评价中存在但锅底表中不存在或非活跃`);
        });
        
        // 统计这些无效ID的评价数量
        const invalidReviews = reviews.filter(review => invalidBaseIds.includes(review.hotpotBaseId));
        console.log(`   无效评价数量: ${invalidReviews.length}`);
      } else {
        console.log('✅ 所有评价的锅底ID都是有效的');
      }
      
      // 检查空锅底ID
      const emptyBaseIdReviews = reviews.filter(review => !review.hotpotBaseId || review.hotpotBaseId.trim() === '');
      if (emptyBaseIdReviews.length > 0) {
        console.log(`⚠️  发现 ${emptyBaseIdReviews.length} 条评价的锅底ID为空`);
      }
    }
    
    console.log('\n📋 建议解决方案:');
    console.log('1. 检查 Google Sheets 中 HotpotBases 工作表的 active 列是否正确设置为 TRUE');
    console.log('2. 确保 Reviews 工作表中的 hotpotBaseId 列与 HotpotBases 中的 id 列完全匹配');
    console.log('3. 删除或修正无效的锅底ID对应的评价');
    console.log('4. 如果锅底已停用，考虑将相关评价迁移到活跃的锅底下');
    
  } catch (error) {
    console.log('❌ 调试过程中出错:', error.message);
  }
}

debugDataIssues(); 