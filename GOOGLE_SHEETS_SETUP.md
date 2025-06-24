# Google Sheets 设置指南

## 1. 创建Google Sheets

### 1.1 创建新的Google Spreadsheet
1. 访问 [Google Sheets](https://sheets.google.com)
2. 创建新的空白表格
3. 记录下表格ID（在URL中，格式为：`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`）

### 1.2 创建两个工作表

#### HotpotBases 工作表
创建名为 `HotpotBases` 的工作表，包含以下列：

| A | B | C | D | E |
|---|---|---|---|---|
| id | name_th | name_zh | name_en | active |
| traditional | น้ำซุปแดงแบบดั้งเดิม | 传统红汤锅底 | Traditional Red Soup | TRUE |
| spicy | น้ำซุปมาล่า | 麻辣锅底 | Spicy Mala Soup | TRUE |
| mushroom | น้ำซุปเห็ด | 菌菇锅底 | Mushroom Soup | TRUE |
| tomato | น้ำซุปมะเขือเทศ | 番茄锅底 | Tomato Soup | TRUE |
| clear | น้ำซุปใส | 清汤锅底 | Clear Soup | TRUE |

#### Reviews 工作表
创建名为 `Reviews` 的工作表，包含以下列：

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| id | userName | userPhone | rating | comment | timestamp | hotpotBaseId |

## 2. 设置Google Cloud Console

### 2.1 创建项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 记录项目ID

### 2.2 启用Google Sheets API
1. 在左侧菜单中选择 "API和服务" > "库"
2. 搜索 "Google Sheets API"
3. 点击启用

### 2.3 创建API密钥
1. 在左侧菜单中选择 "API和服务" > "凭据"
2. 点击 "创建凭据" > "API密钥"
3. 复制生成的API密钥
4. 点击 "限制密钥" 并设置：
   - 应用限制：HTTP引用站点
   - API限制：仅Google Sheets API

## 3. 设置Google Apps Script（用于写入数据）

### 3.1 创建Google Apps Script
1. 访问 [Google Apps Script](https://script.google.com/)
2. 创建新项目
3. 将以下代码粘贴到 `Code.gs` 文件中：

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'addReview') {
      const review = data.data;
      const spreadsheetId = '1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0';
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Reviews');
      
      sheet.appendRow([
        review.id,
        review.userName,
        review.userPhone,
        review.rating,
        review.comment,
        review.timestamp,
        review.hotpotBaseId
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({success: true}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Google Apps Script is running');
}
```

### 3.2 部署为Web应用
1. 点击 "部署" > "新建部署"
2. 选择类型：Web应用
3. 执行身份：自己
4. 访问权限：任何人
5. 点击 "部署"
6. 复制生成的Web应用URL

## 4. 配置环境变量

### 4.1 创建 .env 文件
在项目根目录创建 `.env` 文件：

```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_web_app_url_here
```

### 4.2 替换实际值
- `your_api_key_here`: 替换为步骤2.3中创建的API密钥
- `your_spreadsheet_id_here`: 替换为步骤1.1中的表格ID
- `your_apps_script_web_app_url_here`: 替换为步骤3.2中的Web应用URL

## 5. 设置表格权限

### 5.1 公开表格（推荐用于测试）
1. 在Google Sheets中，点击 "共享"
2. 选择 "任何人都可以查看"
3. 点击 "完成"

### 5.2 或设置服务账户（推荐用于生产）
1. 在Google Cloud Console中创建服务账户
2. 下载JSON密钥文件
3. 在Google Sheets中共享给服务账户邮箱

## 6. 测试配置

### 6.1 重启开发服务器
```bash
npm run dev
```

### 6.2 测试功能
1. 打开应用
2. 填写评价表单
3. 提交评价
4. 检查Google Sheets中是否出现新数据
5. 检查排行榜是否更新

## 故障排除

### 常见问题
1. **CORS错误**: 确保API密钥有正确的权限设置
2. **403错误**: 检查表格是否已公开或正确共享
3. **404错误**: 检查表格ID和API密钥是否正确
4. **Apps Script错误**: 检查Web应用URL和权限设置

### 调试技巧
1. 打开浏览器开发者工具查看网络请求
2. 检查控制台错误信息
3. 验证环境变量是否正确加载
4. 测试Google Sheets API是否可访问

node test-apps-script.js 