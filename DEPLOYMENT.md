# 部署指南

## 当前状态

您的项目已经成功运行在：
- **开发服务器**: http://localhost:5173/
- **预览服务器**: http://localhost:4173/

## 数据存储现状

目前项目使用两种数据存储方式：

1. **本地存储 (localStorage)** - 当前正在使用
   - 数据存储在用户浏览器中
   - 数据不会同步到其他设备
   - 适合测试和演示

2. **Google Sheets** - 已配置但需要设置
   - 数据存储在云端Google Sheets中
   - 支持多设备同步
   - 适合生产环境

## 快速设置Google Sheets（推荐）

### 步骤1: 创建Google Sheets
1. 访问 [Google Sheets](https://sheets.google.com)
2. 创建新表格
3. 复制表格ID（URL中的长字符串）

### 步骤2: 设置表格结构
创建两个工作表：

**HotpotBases工作表:**
```
id | name_th | name_zh | name_en | active
traditional | น้ำซุปแดงแบบดั้งเดิม | 传统红汤锅底 | Traditional Red Soup | TRUE
spicy | น้ำซุปมาล่า | 麻辣锅底 | Spicy Mala Soup | TRUE
mushroom | น้ำซุปเห็ด | 菌菇锅底 | Mushroom Soup | TRUE
tomato | น้ำซุปมะเขือเทศ | 番茄锅底 | Tomato Soup | TRUE
clear | น้ำซุปใส | 清汤锅底 | Clear Soup | TRUE
```

**Reviews工作表:**
```
id | userName | userPhone | rating | comment | timestamp | hotpotBaseId
```

### 步骤3: 获取API密钥
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目或选择现有项目
3. 启用Google Sheets API
4. 创建API密钥

### 步骤4: 配置环境变量
1. 复制 `env.example` 为 `.env`
2. 填入您的配置：
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
```

### 步骤5: 测试连接
```bash
npm run test:sheets
```

### 步骤6: 重启应用
```bash
npm run dev
```

## 部署到生产环境

### 选项1: Vercel（推荐）
1. 安装Vercel CLI: `npm i -g vercel`
2. 在项目根目录运行: `vercel`
3. 按照提示配置环境变量

### 选项2: Netlify
1. 构建项目: `npm run build`
2. 将 `dist` 文件夹上传到Netlify
3. 在Netlify设置中配置环境变量

### 选项3: GitHub Pages
1. 构建项目: `npm run build`
2. 将 `dist` 文件夹内容推送到GitHub Pages分支

## 环境变量配置

在生产环境中，需要设置以下环境变量：

```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_url_here
```

## 安全注意事项

1. **API密钥安全**: 不要将API密钥提交到Git仓库
2. **表格权限**: 设置适当的表格访问权限
3. **CORS设置**: 确保API密钥有正确的域名限制
4. **数据备份**: 定期备份Google Sheets数据

## 故障排除

### 常见问题
1. **CORS错误**: 检查API密钥的域名限制
2. **403错误**: 确保表格已公开或正确共享
3. **环境变量未加载**: 重启开发服务器

### 调试步骤
1. 运行 `npm run test:sheets` 检查连接
2. 查看浏览器控制台错误信息
3. 检查网络请求状态
4. 验证Google Sheets表格结构

## 下一步

1. 按照上述步骤设置Google Sheets
2. 测试数据读写功能
3. 部署到生产环境
4. 监控应用性能和错误

如需详细设置说明，请参考 `GOOGLE_SHEETS_SETUP.md` 文件。 