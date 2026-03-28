# 灵笼看板 v3.0 架构文档

## 系统概述

灵笼看板 v3.0 是一个基于 React + TypeScript 的现代化数据可视化平台，采用模块化架构设计，包含四大核心模块：

- **TLC** (Task Lifecycle Controller) - 任务看板
- **LOS** (Learning Objective System) - 学习曲线
- **MSS** (Monitoring & Status System) - 监控面板
- **DRS** (Daily Report System) - 日报模块

## 技术栈

### 核心框架
- **React 18** - UI 框架
- **TypeScript** - 类型系统
- **Vite 5** - 构建工具
- **Zustand** - 状态管理

### UI 组件
- **Ant Design 5** - 组件库
- **Tailwind CSS** - 样式工具
- **Framer Motion** - 动画库

### 数据可视化
- **ECharts** - 图表库
- **Recharts** - React 图表组件

### 工具库
- **TanStack Query** - 数据获取
- **Day.js** - 日期处理
- **Axios** - HTTP 客户端
- **React Router 6** - 路由管理

## 项目结构

```
lingma-v3-dev/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 客户端
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   │   ├── common/        # 通用组件
│   │   └── Layout/        # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── Home/          # 首页
│   │   ├── TLC/           # 任务看板
│   │   ├── LOS/           # 学习曲线
│   │   ├── MSS/           # 监控面板
│   │   └── DRS/           # 日报模块
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用入口
│   ├── main.tsx           # 渲染入口
│   └── index.css          # 全局样式
├── docs/                  # 文档
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 模块架构

### TLC - 任务看板

**功能特性：**
- 多视图模式（看板/列表/甘特图/日历）
- 拖拽排序
- 任务筛选和搜索
- 优先级和状态管理

**核心组件：**
- `KanbanView` - 看板视图
- `ListView` - 列表视图
- `GanttView` - 甘特图
- `CalendarView` - 日历视图
- `TaskModal` - 任务编辑弹窗

### LOS - 学习曲线

**功能特性：**
- 技能树展示
- 学习进度追踪
- 经验值系统
- 学习目标管理

**核心组件：**
- `LearningChart` - 学习曲线图表
- `SkillTree` - 技能树
- `GoalList` - 目标列表

### MSS - 监控面板

**功能特性：**
- 实时指标监控
- 告警管理
- 服务状态检查
- 历史趋势分析

**核心组件：**
- `MetricCard` - 指标卡片
- `MetricChart` - 指标图表
- `AlertList` - 告警列表
- `ServiceStatusList` - 服务状态列表

### DRS - 日报模块

**功能特性：**
- 日报编辑
- 任务关联
- 心情记录
- 导出分享

**核心组件：**
- `ReportEditor` - 日报编辑器
- `ReportDetail` - 日报详情
- `ReportStats` - 统计面板

## 状态管理

使用 Zustand 进行状态管理，按模块划分 Store：

```typescript
// stores/
├── appStore.ts      // 全局应用状态
├── taskStore.ts     // 任务状态
├── learningStore.ts // 学习状态
├── monitorStore.ts  // 监控状态
└── reportStore.ts   // 日报状态
```

### 持久化

使用 `zustand/middleware` 的 `persist` 中间件实现状态持久化：

```typescript
export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({ ... }),
    { name: 'lingma-task-storage' }
  )
);
```

## 路由设计

```
/           - 首页
/tlc/*      - 任务看板
  /tlc/new  - 新建任务
/los/*      - 学习曲线
/mss/*      - 监控面板
/drs/*      - 日报模块
  /drs/new  - 新建日报
  /drs/edit/:id - 编辑日报
  /drs/view/:id - 查看日报
```

## 样式方案

### Tailwind CSS
- 原子化 CSS 类
- 响应式设计
- 自定义配置

### Ant Design
- 组件样式覆盖
- 主题定制

### CSS 变量
```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
}
```

## 性能优化

1. **代码分割**
   - 路由级别懒加载
   - 组件按需加载

2. **状态优化**
   - 状态选择性订阅
   - 避免不必要重渲染

3. **图表优化**
   - 数据采样
   - 虚拟滚动

4. **缓存策略**
   - TanStack Query 缓存
   - 本地存储持久化

## 开发规范

### 命名规范
- 组件：PascalCase
- 文件：kebab-case
- 变量：camelCase
- 常量：UPPER_SNAKE_CASE

### 代码风格
- ESLint + Prettier
- TypeScript 严格模式
- 函数式组件优先

### Git 规范
- 分支命名：`feature/module-name`
- Commit 格式：`type(scope): message`

## 部署

### 构建
```bash
npm run build
```

### 输出
- `dist/` 目录
- 静态文件托管

### 环境变量
- `.env` - 默认配置
- `.env.local` - 本地配置
- `.env.production` - 生产配置
