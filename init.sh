#!/bin/bash

# JustLearnIt 初始化脚本

echo "开始初始化 JustLearnIt 项目..."

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js 16+"
    exit 1
fi

# 检查 npm 是否已安装
if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装，请先安装 npm"
    exit 1
fi

echo "Node.js 和 npm 已安装，继续..."

# 安装依赖
echo "正在安装项目依赖..."
npm install

if [ $? -eq 0 ]; then
    echo "依赖安装成功！"
else
    echo "依赖安装失败，请检查网络连接或 package.json 文件"
    exit 1
fi

echo "初始化完成！"
echo "使用以下命令启动项目："
echo "  npm run dev:full  # 同时启动前端和后端"
echo "  npm run dev       # 仅启动前端"
echo "  npm run server    # 仅启动后端"
