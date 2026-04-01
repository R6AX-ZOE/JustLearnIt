@echo off

REM JustLearnIt 启动脚本

echo 启动 JustLearnIt 项目...

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    npm install
    
    if %errorlevel% neq 0 (
        echo 依赖安装失败，请检查网络连接或 package.json 文件
        pause
        exit /b 1
    )
)

REM 启动前端和后端
echo 正在启动前端和后端服务...
npm run dev:full
