#!/bin/bash
# 创建 public 目录并复制图片资源

echo "正在设置图片资源..."

# 创建 public/img 目录
mkdir -p public/img

# 复制头像图片
cp img/header.jpeg public/img/

# 复制 favicon
cp favicon.ico public/

echo "✓ 图片资源设置完成！"
echo "现在可以运行: npm install && npm run dev"
