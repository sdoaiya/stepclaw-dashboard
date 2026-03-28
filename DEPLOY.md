# 灵笼看板 v3.0 部署指南

## 修复内容 (v3.0.1)

### 🐛 MSS内存泄漏修复
1. **修复自动刷新导致的内存泄漏**
   - 使用 `useRef` 存储interval引用，确保组件卸载时正确清理
   - 修复了useEffect依赖数组导致的无限循环问题
   - 添加interval清理逻辑，防止多个interval同时运行

2. **修复ECharts内存泄漏**
   - 添加ECharts实例清理，组件卸载时调用 `dispose()`
   - 使用 `notMerge` 和 `lazyUpdate` 优化图表更新性能

3. **性能优化**
   - MetricCard组件添加 `React.memo` 减少不必要的重渲染
   - 使用 `useCallback` 优化事件处理函数

### ⚡ 构建优化
- 添加代码分割策略，按 vendor/ui/charts/utils 分包
- 启用Terser压缩，移除console和debugger语句
- 设置GitHub Pages部署基础路径 `/lingma-v3/`

## GitHub Pages 部署步骤

### 1. 创建GitHub仓库
```bash
# 在GitHub上创建新仓库，命名为 lingma-v3
git init
git add .
git commit -m "Initial commit: 灵笼看板 v3.0.1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lingma-v3.git
git push -u origin main
```

### 2. 配置GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"

### 3. 自动部署
推送代码到main分支后，GitHub Actions会自动构建并部署到GitHub Pages。

部署地址: `https://YOUR_USERNAME.github.io/lingma-v3/`

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
lingma-v3-dev/
├── .github/workflows/    # GitHub Actions 工作流
├── dist/                 # 构建输出目录
├── docs/                 # 文档
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── components/       # 公共组件
│   ├── pages/            # 页面组件
│   │   ├── TLC/          # 任务看板模块
│   │   ├── LOS/          # 学习曲线模块
│   │   ├── MSS/          # 监控面板模块 (已修复内存泄漏)
│   │   └── DRS/          # 日报模块
│   ├── stores/           # 状态管理 (Zustand)
│   ├── types/            # TypeScript类型
│   └── utils/            # 工具函数
├── package.json
├── tsconfig.json
└── vite.config.ts        # Vite配置 (已优化)
```

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **UI组件**: Ant Design 5.x
- **图表库**: ECharts + Recharts
- **样式方案**: Tailwind CSS
- **构建工具**: Vite 5.x

## 更新日志

详见 [docs/CHANGELOG.md](./docs/CHANGELOG.md)
