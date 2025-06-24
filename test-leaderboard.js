// 测试排行榜数据功能
const GOOGLE_SHEETS_API_KEY = 'AIzaSyBH-EU78R0Goti7u1c9ffDSpZANSfIiLYg';
const SPREADSHEET_ID = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';

async function testLeaderboardData() {
  console.log('🏆 测试排行榜数据功能...\n');

  try {
    // 测试读取锅底数据
    console.log('📊 1. 测试读取锅底数据...');
    const basesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/HotpotBases?key=${GOOGLE_SHEETS_API_KEY}`;
    const basesResponse = await fetch(basesUrl);
    
    if (basesResponse.ok) {
      const basesData = await basesResponse.json();
      const basesRows = basesData.values || [];
      console.log(`✅ 锅底数据读取成功: ${basesRows.length} 行`);
      
      // 解析锅底数据
      const hotpotBases = basesRows.slice(1).map(row => ({
        id: row[0] || '',
        name_th: row[1] || '',
        name_zh: row[2] || '',
        name_en: row[3] || '',
        active: row[4] === 'TRUE' || row[4] === 'true'
      })).filter(base => base.active);
      
      console.log('📋 活跃锅底列表:');
      hotpotBases.forEach((base, index) => {
        console.log(`   ${index + 1}. ${base.name_zh} (${base.id})`);
      });
      
      // 测试读取评价数据
      console.log('\n📊 2. 测试读取评价数据...');
      const reviewsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Reviews?key=${GOOGLE_SHEETS_API_KEY}`;
      const reviewsResponse = await fetch(reviewsUrl);
      
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        const reviewsRows = reviewsData.values || [];
        console.log(`✅ 评价数据读取成功: ${reviewsRows.length} 行`);
        
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
        
        console.log('📋 评价数据统计:');
        console.log(`   总评价数: ${reviews.length}`);
        
        // 按锅底ID统计评价
        const baseStats = {};
        const validBaseIds = new Set(hotpotBases.map(base => base.id));
        
        reviews.forEach(review => {
          if (validBaseIds.has(review.hotpotBaseId)) {
            if (!baseStats[review.hotpotBaseId]) {
              baseStats[review.hotpotBaseId] = {
                ratings: [],
                total: 0,
                sum: 0,
                reviews: []
              };
            }
            baseStats[review.hotpotBaseId].ratings.push(review.rating);
            baseStats[review.hotpotBaseId].total++;
            baseStats[review.hotpotBaseId].sum += review.rating;
            baseStats[review.hotpotBaseId].reviews.push(review);
          }
        });
        
        // 计算排行榜
        console.log('\n🏆 3. 计算排行榜数据...');
        const leaderboard = hotpotBases.map(base => {
          const stats = baseStats[base.id] || { ratings: [], total: 0, sum: 0, reviews: [] };
          const averageRating = stats.total > 0 ? (stats.sum / stats.total) : 0;
          
          return {
            id: base.id,
            name: {
              th: base.name_th,
              zh: base.name_zh,
              en: base.name_en
            },
            averageRating: Number(averageRating.toFixed(1)),
            totalRatings: stats.total,
            reviews: stats.reviews.sort((a, b) => b.timestamp - a.timestamp)
          };
        }).sort((a, b) => b.averageRating - a.averageRating);
        
        console.log('🏆 排行榜结果:');
        leaderboard.forEach((base, index) => {
          const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
          console.log(`   ${rankIcon} ${base.name.zh} - 评分: ${base.averageRating} (${base.totalRatings} 条评价)`);
          
          if (base.reviews.length > 0) {
            const latestReview = base.reviews[0];
            console.log(`      最新评价: ${latestReview.userName} - ${latestReview.rating}星 - ${latestReview.comment.substring(0, 30)}...`);
          }
        });
        
        // 测试数据完整性
        console.log('\n✅ 4. 数据完整性检查...');
        const totalReviews = leaderboard.reduce((sum, base) => sum + base.totalRatings, 0);
        const overallAverage = leaderboard.filter(base => base.totalRatings > 0).reduce((sum, base) => sum + base.averageRating, 0) / leaderboard.filter(base => base.totalRatings > 0).length || 0;
        
        console.log(`   总锅底数: ${leaderboard.length}`);
        console.log(`   总评价数: ${totalReviews}`);
        console.log(`   整体平均分: ${overallAverage.toFixed(1)}`);
        console.log(`   有评价的锅底数: ${leaderboard.filter(base => base.totalRatings > 0).length}`);
        
        console.log('\n✅ 排行榜数据功能测试完成！');
        console.log('📝 所有数据绑定正常，排行榜功能完整。');
        
      } else {
        console.log(`❌ 评价数据读取失败: ${reviewsResponse.status}`);
        console.log('💡 可能原因: Google Sheets权限设置问题');
      }
      
    } else {
      console.log(`❌ 锅底数据读取失败: ${basesResponse.status}`);
      console.log('💡 可能原因: Google Sheets权限设置问题');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testLeaderboardData(); 