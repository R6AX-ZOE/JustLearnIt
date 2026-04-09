# 如何查看前后端日志

## 问题诊断步骤

### 1. 查看前端日志（浏览器控制台）

1. 打开浏览器访问 `http://localhost:5175`
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. 执行删除操作
5. 查看控制台输出，应该看到：
   ```
   === handleMenuItemClick ===
   Action: Delete
   Type: directory
   Target: {id: "...", name: "..."}
   Selected Project: {id: "...", name: "..."}
   Deleting directory with ID: ...
   From project with ID: ...
   Request URL: /api/learning/project/.../directory/...
   ```

### 2. 查看后端日志（Terminal 6）

1. 在IDE底部找到 **Terminal** 面板
2. 切换到 **Terminal 6**（运行 `node server.js` 的终端）
3. 执行删除操作后，应该看到：
   ```
   === 2026-04-07T18:XX:XX.XXXZ ===
   DELETE /api/learning/project/.../directory/...
   Headers: {...}
   
   === DELETE Directory Request ===
   Project ID: ...
   Directory ID: ...
   Project found: ...
   Project directories: [...]
   Directory deleted successfully
   ```

### 3. 如果看不到DELETE请求

#### 前端没有发送请求：
- 检查浏览器控制台是否有JavaScript错误
- 检查 `selectedProject` 是否为null
- 检查 `target` 对象是否正确

#### 后端没有收到请求：
- 检查Vite代理配置（vite.config.js）
- 检查后端服务器是否运行（`netstat -ano | findstr :3002`）
- 检查端口是否被占用

### 4. 测试后端是否正常

运行测试脚本：
```powershell
node test-backend.js
```

应该看到：
```
✅ Server is running
✅ Learning routes are working
✅ Delete route is working
```

## 常见问题

### 问题1：看不到Terminal 6
**解决方案**：
1. 在IDE底部点击 **Terminal** 标签
2. 点击下拉菜单，选择 **Terminal 6**
3. 或者运行新的后端服务器：
   ```powershell
   node server.js
   ```

### 问题2：前端显示404错误
**可能原因**：
1. 后端服务器没有运行
2. 后端服务器运行的是旧代码
3. 项目ID或目录ID不存在

**解决方案**：
1. 检查后端服务器是否运行
2. 重启后端服务器
3. 查看后端日志确认请求是否到达

### 问题3：删除操作没有反应
**可能原因**：
1. 前端代码有错误
2. 右键菜单没有正确触发
3. `selectedProject` 为null

**解决方案**：
1. 查看浏览器控制台日志
2. 检查 `handleMenuItemClick` 是否被调用
3. 检查 `selectedProject` 状态

## 调试技巧

### 1. 使用浏览器开发者工具
- **Console**：查看JavaScript日志
- **Network**：查看HTTP请求和响应
- **Sources**：设置断点调试

### 2. 查看网络请求
1. 打开开发者工具
2. 切换到 **Network** 标签
3. 执行删除操作
4. 查看是否有DELETE请求
5. 点击请求查看详情（Headers、Response等）

### 3. 手动测试API
```powershell
# 测试后端是否运行
Invoke-WebRequest -Uri http://localhost:3002/

# 测试删除API
Invoke-WebRequest -Uri http://localhost:3002/api/learning/project/PROJECT_ID/directory/DIRECTORY_ID -Method DELETE
```
