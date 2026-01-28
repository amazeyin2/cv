# Amazeyin - 极简 3D 个人网站

> 极致简约的赛博风格 3D Portfolio，采用 React Three Fiber 构建

## 🚀 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 构建生产版本

```bash
npm run build
```

## 📦 一键部署到 Vercel

### 方法一：通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录
vercel login

# 部署
vercel
```

### 方法二：通过 Vercel Dashboard

1. 将项目推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 点击「New Project」导入你的 GitHub 仓库
4. Vercel 会自动检测 Vite 项目，无需额外配置
5. 点击「Deploy」，等待构建完成

**部署配置（自动检测）：**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 🎨 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **3D 渲染**: @react-three/fiber + @react-three/drei + Three.js
- **动画**: Framer Motion
- **样式**: Tailwind CSS
- **部署**: Vercel

## 🎯 核心特性

1. **极简几何体**: 二十面体 wireframe 作为中心视觉，缓慢自转
2. **视差交互**: 鼠标移动产生轻微 3D 倾斜效果
3. **技能星座**: 技能标签以发光点+连线组成星座网络
4. **粒子场**: 800+ 粒子构成的深空背景
5. **滚轮交互**: 滚动时相机推拉，揭示信息层
6. **响应式**: 移动端适配，保持流畅 60fps

## 📁 项目结构

```
amazeyin-cv/
├── public/
│   └── favicon.ico
├── src/
│   ├── App.tsx           # 主应用 + 3D 场景
│   ├── main.tsx          # 入口文件
│   └── index.css         # 全局样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 自定义内容

在 [`src/App.tsx`](src/App.tsx) 中修改：

- **个人信息**: 修改 `FloatingText` 组件中的标题、描述
- **技能标签**: 修改 `SkillConstellation` 中的 `skills` 数组
- **社交链接**: 修改底部的链接地址
- **配色**: 在 `tailwind.config.js` 中调整 `cyber-cyan` 等颜色

## 🎨 设计理念

**三大极简细节：**

1. **虚空几何**: 纯黑背景 + wireframe 几何体，保留最纯粹的 3D 线条美学
2. **信息悬浮**: 所有文字以 3D 分层悬浮，拒绝传统卡片，像数字雕塑一样存在
3. **冷光克制**: 仅用 cyan (#00f0ff) 单一高亮色 + 极淡辉光，营造未来科技感

**为什么符合「3D 极简」美学：**
- 画面元素少到极致（一个几何体 + 六个技能点 + 纯文字）
- 没有任何装饰性图案、渐变背景、或花哨特效
- 交互微妙但存在感强（视差、辉光、相机推拉）
- 整体气质像「赛博空间中的数字冥想」

## 📝 许可

MIT © Amazeyin
