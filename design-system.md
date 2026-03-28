# 灵笼看板 v2.0 设计规范文档

## 1. 设计概述

### 1.1 设计目标
恢复原版 v4.x 的精致视觉效果，同时适配 GitHub Pages 静态部署。

### 1.2 设计理念
- **玻璃态美学**: 使用 backdrop-filter 实现毛玻璃效果
- **赛博朋克光效**: 蓝紫渐变配合动态光效
- **深邃背景**: 深色主题营造沉浸式体验
- **精致细节**: 阴影、圆角、过渡动画的精心调校

---

## 2. 色彩规范

### 2.1 主色调
```css
--primary-blue: #60a5fa;      /* 天蓝色 - 主要强调色 */
--primary-purple: #a78bfa;    /* 紫罗兰 - 次要强调色 */
--primary-cyan: #22d3ee;      /* 青色 - 辅助强调色 */
--primary-pink: #f472b6;      /* 粉色 - 高亮强调色 */
```

### 2.2 背景色
```css
--bg-deep: #0a0f1a;           /* 深邃背景 - 主背景 */
--bg-dark: #0f172a;           /* 深色背景 - 卡片底色 */
--bg-card: rgba(30, 41, 59, 0.6);  /* 卡片背景 - 半透明 */
--bg-glass: rgba(255, 255, 255, 0.05); /* 玻璃态背景 */
```

### 2.3 渐变定义
```css
--gradient-primary: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
--gradient-bg: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
--gradient-glow: linear-gradient(90deg, #60a5fa, #a78bfa, #22d3ee);
--gradient-border: linear-gradient(90deg, rgba(96, 165, 250, 0.5), rgba(167, 139, 250, 0.5));
```

### 2.4 功能色
```css
--success: #10b981;           /* 成功/在线 */
--warning: #f59e0b;           /* 警告/中等优先级 */
--danger: #ef4444;            /* 危险/高优先级 */
--info: #3b82f6;              /* 信息 */
```

### 2.5 文字色
```css
--text-primary: #f8fafc;      /* 主要文字 - 白色 */
--text-secondary: #e2e8f0;    /* 次要文字 - 浅灰 */
--text-muted: #94a3b8;        /* 辅助文字 - 灰色 */
--text-subtle: #64748b;       /* 微弱文字 - 深灰 */
```

---

## 3. 字体规范

### 3.1 字体栈
```css
--font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
--font-mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;
```

### 3.2 字号规范
```css
--text-xs: 12px;      /* 标签、辅助文字 */
--text-sm: 13px;      /* 次要信息 */
--text-base: 14px;    /* 正文 */
--text-lg: 16px;      /* 小标题 */
--text-xl: 18px;      /* 章节标题 */
--text-2xl: 24px;     /* 大标题 */
--text-3xl: 32px;     /* 统计数字 */
```

### 3.3 字重规范
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 4. 间距规范

### 4.1 基础间距
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

### 4.2 组件间距
```css
--card-padding: 24px;
--section-gap: 24px;
--grid-gap: 20px;
--element-gap: 16px;
```

---

## 5. 圆角规范

```css
--radius-sm: 6px;     /* 小元素 */
--radius-md: 8px;     /* 按钮、输入框 */
--radius-lg: 12px;    /* 卡片 */
--radius-xl: 16px;    /* 大卡片、区块 */
--radius-full: 9999px; /* 完全圆角 */
```

---

## 6. 阴影规范

### 6.1 卡片阴影
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
--shadow-glow: 0 0 20px rgba(96, 165, 250, 0.3);
--shadow-glow-purple: 0 0 20px rgba(167, 139, 250, 0.3);
```

### 6.2 悬浮阴影
```css
--shadow-hover: 0 10px 40px rgba(96, 165, 250, 0.15);
```

---

## 7. 玻璃态效果

### 7.1 基础玻璃态
```css
.glass {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(96, 165, 250, 0.1);
}
```

### 7.2 高级玻璃态
```css
.glass-premium {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 8. 动画规范

### 8.1 过渡时间
```css
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;
```

### 8.2 缓动函数
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 8.3 关键帧动画
```css
/* 脉冲动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 旋转动画 */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 悬浮动画 */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 光效扫过 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 呼吸光晕 */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(96, 165, 250, 0.3); }
  50% { box-shadow: 0 0 40px rgba(96, 165, 250, 0.6); }
}
```

---

## 9. 组件样式

### 9.1 统计卡片
```css
.stat-card {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #60a5fa, #a78bfa);
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(96, 165, 250, 0.3);
  box-shadow: 0 10px 40px rgba(96, 165, 250, 0.1);
}

.stat-card:hover::before {
  opacity: 1;
}
```

### 9.2 员工卡片
```css
.employee-card {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 16px;
}

.employee-card:hover {
  border-color: rgba(96, 165, 250, 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.1);
}
```

### 9.3 任务项
```css
.task-item {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 10px;
  padding: 16px;
  border: 1px solid rgba(96, 165, 250, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.task-item:hover {
  border-color: rgba(96, 165, 250, 0.2);
  background: rgba(15, 23, 42, 0.7);
}
```

### 9.4 按钮样式
```css
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}
```

### 9.5 标签样式
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
}

.badge-success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-idle {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.3);
}
```

### 9.6 标签页
```css
.tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  width: fit-content;
}

.tab {
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #94a3b8;
  transition: all 0.2s;
  border: none;
  background: transparent;
}

.tab:hover {
  color: #e2e8f0;
}

.tab.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
```

---

## 10. 布局规范

### 10.1 容器
```css
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px;
}
```

### 10.2 网格系统
```css
/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 员工网格 */
.employees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
```

### 10.3 响应式断点
```css
/* 移动端 */
@media (max-width: 768px) {
  .container { padding: 20px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .employees-grid { grid-template-columns: 1fr; }
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}

/* 桌面端 */
@media (min-width: 1025px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 11. 特殊效果

### 11.1 动态背景
```css
/* 渐变背景 */
body {
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  background-attachment: fixed;
}

/* 粒子效果容器 */
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
```

### 11.2 光效装饰
```css
/* 顶部光效 */
.glow-top {
  position: fixed;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* 角落光晕 */
.glow-corner {
  position: fixed;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%);
  pointer-events: none;
}
```

---

## 12. 部门配色

| 部门 | 图标 | 颜色 |
|------|------|------|
| 中枢 | 🎯 | #ef4444 (红色) |
| 情报 | 🔍 | #3b82f6 (蓝色) |
| 开发 | 💻 | #10b981 (绿色) |
| 文档 | 📝 | #f59e0b (橙色) |
| 视觉 | 🎨 | #8b5cf6 (紫色) |
| 演示 | 📊 | #ec4899 (粉色) |
| 安卫 | 🛡️ | #06b6d4 (青色) |

---

## 13. 优先级配色

| 优先级 | 颜色 | 用途 |
|--------|------|------|
| High | #ef4444 | 高优先级任务 |
| Medium | #f59e0b | 中等优先级任务 |
| Low | #10b981 | 低优先级任务 |

---

*文档版本: v2.0*
*设计: 灵设 (UI设计师)*
*日期: 2026-03-28*
