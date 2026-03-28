# 开发指南

## 快速开始

### 1. 安装依赖

```bash
cd lingma-v3-dev
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 启动

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构说明

```
src/
├── api/           # API 客户端和接口定义
├── components/    # 可复用组件
│   ├── common/    # 通用组件（StatCard, ChartCard等）
│   └── Layout/    # 布局组件（Sidebar, Header等）
├── pages/         # 页面组件
│   ├── Home/      # 首页仪表盘
│   ├── TLC/       # 任务看板模块
│   ├── LOS/       # 学习曲线模块
│   ├── MSS/       # 监控面板模块
│   └── DRS/       # 日报模块
├── stores/        # Zustand 状态管理
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数和常量
├── App.tsx        # 应用根组件
├── main.tsx       # 应用入口
└── index.css      # 全局样式
```

## 开发规范

### 组件开发

1. 使用函数式组件 + Hooks
2. 组件文件使用 PascalCase 命名
3. 每个组件一个文件，放在对应目录

```tsx
// 示例组件
import { Card } from 'antd';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <Card title={title}>内容</Card>;
}
```

### 状态管理

使用 Zustand 进行状态管理：

```tsx
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 使用
const count = useMyStore((state) => state.count);
```

### 样式编写

1. 优先使用 Tailwind CSS 工具类
2. 复杂样式使用 CSS Modules 或 styled-components
3. 全局样式放在 index.css

```tsx
// Tailwind 示例
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  内容
</div>
```

## 模块开发指南

### 添加新页面

1. 在 `src/pages/` 下创建新目录
2. 创建 `index.tsx` 作为页面入口
3. 在 `App.tsx` 中添加路由

### 添加新组件

1. 在 `src/components/` 下选择合适位置
2. 创建组件文件
3. 在 `index.ts` 中导出

### 添加新 Store

1. 在 `src/stores/` 下创建文件
2. 定义状态和操作
3. 在 `stores/index.ts` 中导出

## 调试技巧

### 使用 React DevTools

安装浏览器扩展，可以查看组件树和状态

### 使用 Zustand DevTools

```tsx
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools((set) => ({ ... }))
);
```

### 日志调试

```tsx
// 在组件中添加
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

## 常见问题

### 1. 依赖安装失败

```bash
# 清除缓存后重试
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. 端口被占用

```bash
# 修改 vite.config.ts 中的端口
export default defineConfig({
  server: {
    port: 3001, // 修改端口
  },
});
```

### 3. 类型错误

```bash
# 运行类型检查
npm run typecheck
```

## 提交代码

```bash
# 格式化代码
npm run lint

# 添加更改
git add .

# 提交
git commit -m "feat(module): description"

# 推送
git push
```

## 构建部署

### 本地预览构建

```bash
npm run build
npm run preview
```

### 部署到服务器

将 `dist/` 目录内容部署到静态文件服务器

## 联系方式

如有问题，请联系开发团队
