# Google Sheets 代理配置说明

## 当前配置架构

您的项目使用代理技术来访问Google Sheets，架构如下：

```
前端应用 → 本地代理API (3000端口) → Google Apps Script → Google Sheets
```

## 配置详情

### 1. 环境变量配置 (env文件)
```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyBH-EU78R0Goti7u1c9ffDSpZANSfIiLYg
VITE_GOOGLE_SPREADSHEET_ID=1M3No1PW2kZlx2soy2RWcapQ0FxowX5o5RmIqkUteCg0
VITE_GOOGLE_APPS_SCRIPT_URL=http://localhost:3000/api/google-sheets-proxy
```

### 2. 代理API配置 (api/google-sheets-proxy.js)
- 代理地址：`http://localhost:3000/api/google-sheets-proxy`
- 目标Google Apps Script：`https://script.google.com/macros/s/AKfycbwSlgqj4XmcdwKVUSGQ8m-nq5oMUhPwYUMWg0bxOnWHmKM8iamvCRuTZNsjJPhwiXsV8A/exec`

### 3. Vite代理配置 (vite.config.ts)
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api')
    }
  }
}
```

## 数据流程

### 读取数据（排行榜显示）
1. 前端直接调用Google Sheets API读取数据
2. 使用API密钥访问公开的Google Sheets
3. 获取锅底数据和评价数据
4. 计算排行榜并显示

### 写入数据（提交评价）
1. 用户提交评价表单
2. 前端发送POST请求到本地代理API
3. 代理API转发请求到Google Apps Script
4. Google Apps Script写入数据到Google Sheets
5. 返回成功/失败响应

## 测试方法

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 测试代理API
```bash
node test-proxy.js
```

### 3. 测试完整功能
1. 打开浏览器访问应用
2. 填写评价表单并提交
3. 检查Google Sheets中是否出现新数据
4. 检查排行榜是否更新

## 故障排除

### 常见问题

1. **403错误（读取数据）**
   - 确保Google Sheets表格已公开
   - 检查API密钥权限

2. **代理连接失败**
   - 确保开发服务器在3000端口运行
   - 检查代理API文件路径

3. **数据写入失败**
   - 检查Google Apps Script URL是否正确
   - 确保Google Apps Script已部署为Web应用
   - 检查Google Apps Script权限设置

### 调试步骤

1. 运行诊断脚本：
   ```bash
   node debug-sheets.js
   ```

2. 检查网络请求：
   - 打开浏览器开发者工具
   - 查看Network标签页
   - 检查API请求状态

3. 验证Google Sheets权限：
   - 确保表格设置为"任何人都可以查看"
   - 检查工作表名称是否正确

## 优势

使用代理技术的优势：

1. **避免CORS问题**：前端不直接访问Google Apps Script
2. **更好的安全性**：API密钥和脚本URL在服务器端管理
3. **灵活性**：可以添加额外的验证和日志记录
4. **错误处理**：统一的错误处理和响应格式

## 注意事项

1. 确保开发服务器始终运行在3000端口
2. 生产环境需要部署代理API到服务器
3. 定期检查Google Apps Script的配额限制
4. 监控API调用频率和错误率 