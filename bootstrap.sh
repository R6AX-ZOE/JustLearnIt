#!/bin/bash

# JustLearnIt 启动脚本

echo "启动 JustLearnIt 项目..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "依赖未安装，正在安装..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "依赖安装失败，请检查网络连接或 package.json 文件"
        exit 1
    fi
fi

# 启动前端和后端
echo "正在启动前端和后端服务..."
npm run dev:full
