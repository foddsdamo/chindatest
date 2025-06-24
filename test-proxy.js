// 测试代理API
async function testProxyAPI() {
  console.log('🧪 测试代理API配置...\n');

  const proxyUrl = 'http://localhost:3000/api/google-sheets-proxy';
  
  // 测试数据
  const testReview = {
    action: 'addReview',
    data: {
      id: Date.now().toString(),
      userName: '代理测试用户',
      userPhone: '0812345678',
      rating: 5,
      comment: '这是通过代理API测试的评价',
      timestamp: Date.now(),
      hotpotBaseId: 'traditional'
    }
  };

  console.log('📋 测试数据:', testReview);
  console.log('🔗 代理URL:', proxyUrl);

  try {
    console.log('\n📤 发送POST请求到代理...');
    
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testReview)
    });

    console.log('📊 响应状态:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.text();
      console.log('✅ 代理请求成功');
      console.log('📄 响应内容:', result);
      
      try {
        const jsonResult = JSON.parse(result);
        if (jsonResult.success) {
          console.log('🎉 数据写入Google Sheets成功！');
        } else {
          console.log('⚠️ 数据写入失败:', jsonResult.error);
        }
      } catch (e) {
        console.log('📝 响应不是JSON格式，但请求成功');
      }
    } else {
      console.log('❌ 代理请求失败');
      const errorText = await response.text();
      console.log('📄 错误响应:', errorText);
    }

  } catch (error) {
    console.log('❌ 请求错误:', error.message);
    console.log('\n💡 可能的原因:');
    console.log('1. 开发服务器未启动 (请运行 npm run dev)');
    console.log('2. 代理API路径不正确');
    console.log('3. 网络连接问题');
  }

  console.log('\n📝 测试完成！');
  console.log('\n🔧 如果测试成功，说明代理配置正确');
  console.log('🔧 如果测试失败，请检查:');
  console.log('   1. 开发服务器是否在3000端口运行');
  console.log('   2. 代理API文件是否正确配置');
  console.log('   3. Google Apps Script URL是否正确');
}

testProxyAPI(); 