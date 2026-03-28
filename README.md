# 灵笼看板 v3.0 (LingMa Dashboard v3.0)

> "灵笼"寓意灵动高效的任务管理与数据笼络系统

## 项目简介

灵笼看板 v3.0 是一个集任务管理、学习追踪、系统监控和日报生成于一体的综合性数据可视化平台。

## 四大核心模块

### 🎯 TLC - Task Lifecycle Controller (任务看板)
- 敏捷任务管理，支持看板视图、列表视图、甘特图
- 任务生命周期全流程追踪
- 拖拽排序、标签分类、优先级管理
- 团队协作与任务分配

### 📈 LOS - Learning Objective System (学习曲线)
- 个人/团队学习进度可视化
- 技能树与知识图谱展示
- 学习曲线分析与预测
- 目标达成追踪

### 🔍 MSS - Monitoring & Status System (监控面板)
- 实时系统状态监控
- 性能指标可视化
- 异常告警与通知
- 历史数据趋势分析

### 📊 DRS - Daily Report System (日报模块)
- 自动生成日报/周报/月报
- 多维度数据统计
- 自定义报告模板
- 一键导出分享

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **UI组件**: Ant Design 5.x
- **图表库**: ECharts + Recharts
- **样式方案**: Tailwind CSS
- **构建工具**: Vite 5.x
- **数据获取**: TanStack Query

## 快速开始

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
├── src/
│   ├── components/     # 公共组件
│   ├── pages/          # 页面组件
│   │   ├── TLC/        # 任务看板模块
│   │   ├── LOS/        # 学习曲线模块
│   │   ├── MSS/        # 监控面板模块
│   │   └── DRS/        # 日报模块
│   ├── stores/         # 状态管理
│   ├── utils/          # 工具函数
│   ├── types/          # TypeScript类型定义
│   ├── api/            # API接口
│   └── assets/         # 静态资源
├── public/             # 公共资源
└── docs/               # 文档
```

## 版本历史

- v3.0.0 - 2024.03 - 四大模块完整实现，全新UI设计
- v2.0.0 - 2023.12 - 基础看板功能
- v1.0.0 - 2023.09 - 项目初始化

## License

MIT
