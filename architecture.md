# 灵笼看板 v2.0 技术架构文档

> 版本: v2.0  
> 作者: 灵构 (系统架构师)  
> 日期: 2026-03-28  
> 状态: 设计完成

---

## 1. 架构概述

### 1.1 设计目标

灵笼看板 v2.0 采用**纯前端静态架构**，专为 GitHub Pages 静态部署优化，实现：

- ✅ 零后端依赖，纯静态文件部署
- ✅ 实时数据感知（30秒轮询刷新）
- ✅ 响应式布局，支持多端访问
- ✅ 模块化组件设计，易于维护扩展
- ✅ 状态管理清晰，数据流单向流动

### 1.2 架构选型

| 层级 | 技术方案 | 说明 |
|------|----------|------|
| **部署** | GitHub Pages | 静态托管，CDN 加速 |
| **数据** | JSON 文件 + GitHub Actions | 每2分钟自动生成 |
| **前端** | 原生 HTML/CSS/JS | 无框架依赖，轻量高效 |
| **状态** | 自定义 Store 模式 | 集中式状态管理 |
| **样式** | CSS Variables + 组件化 CSS | 设计系统驱动 |

---

## 2. 数据流架构

### 2.1 数据流向图

```
┌─────────────────────────────────────────────────────────────────┐
│                        数据源层 (Source)                         │
├─────────────────────────────────────────────────────────────────┤
│  GitHub Actions (每2分钟)  ──►  linglong-data.json              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (HTTP GET)
┌─────────────────────────────────────────────────────────────────┐
│                        数据获取层 (Fetcher)                      │
├─────────────────────────────────────────────────────────────────┤
│  DataService                                                    │
│  ├── fetchData()           // 带缓存清除的获取                  │
│  ├── fetchWithRetry()      // 失败重试机制                      │
│  └── scheduleAutoRefresh() // 30秒定时刷新                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (解析 & 验证)
┌─────────────────────────────────────────────────────────────────┐
│                        状态管理层 (Store)                        │
├─────────────────────────────────────────────────────────────────┤
│  AppStore (单例)                                                │
│  ├── state: { employees, tasks, stats, lastUpdate, loading }   │
│  ├── mutations: SET_DATA, SET_LOADING, SET_ERROR               │
│  ├── actions: loadData(), refreshData()                        │
│  └── getters: onlineCount, deptStats, filteredEmployees        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (订阅通知)
┌─────────────────────────────────────────────────────────────────┐
│                        视图层 (View)                             │
├─────────────────────────────────────────────────────────────────┤
│  组件树                                                         │
│  ├── HeaderComponent        // 头部统计                         │
│  ├── StatsGridComponent     // 统计卡片                         │
│  ├── EmployeeGridComponent  // 员工网格                         │
│  ├── TaskListComponent      // 任务列表                         │
│  ├── TabContainerComponent  // 标签页容器                       │
│  └── ParticleBackground     // 粒子背景                         │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 数据更新机制

```javascript
// 伪代码：数据更新流程
class DataService {
  async loadData() {
    // 1. 设置加载状态
    store.commit('SET_LOADING', true);
    
    try {
      // 2. 带时间戳防止缓存
      const response = await fetch(`linglong-data.json?t=${Date.now()}`);
      const data = await response.json();
      
      // 3. 数据验证
      if (this.validateData(data)) {
        // 4. 更新状态
        store.commit('SET_DATA', data);
        store.commit('SET_LAST_UPDATE', new Date());
      }
    } catch (error) {
      store.commit('SET_ERROR', error);
    } finally {
      store.commit('SET_LOADING', false);
    }
  }
  
  startAutoRefresh() {
    // 每30秒自动刷新
    setInterval(() => this.loadData(), 30000);
  }
}
```

### 2.3 数据结构定义

```typescript
// 核心数据类型定义
interface DashboardData {
  status: 'ok' | 'error';
  timestamp: string;           // ISO 8601 格式
  version: string;             // 数据版本
  stats: {
    online: number;            // 在线人数
    onlineChange: number;      // 环比变化
    tokens: string;            // Token消耗 (格式化)
    tokensChange: number;      // Token环比
    tasks: number;             // 任务总数
    tasksDone: number;         // 已完成任务
    rate: string;              // 实时速率
  };
  employees: Employee[];
  tasks: Task[];
}

interface Employee {
  id: string;                  // 唯一标识
  name: string;                // 姓名
  role: string;                // 职位
  dept: Department;            // 部门
  avatar: string;              // Emoji 头像
  status: 'working' | 'idle';  // 工作状态
  task: string;                // 当前任务
}

interface Task {
  title: string;               // 任务标题
  priority: 'high' | 'medium' | 'low';
  assignee: string;            // 负责人姓名
  dept: Department;            // 所属部门
  time: string;                // 相对时间描述
}

type Department = '中枢' | '情报' | '开发' | '文档' | '视觉' | '演示' | '安卫';
```

---

## 3. 状态管理方案

### 3.1 状态分层架构

```
┌──────────────────────────────────────────────────────────────┐
│                     全局状态 (Global State)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │  dataCache  │ │   uiState   │ │      filterState        │ │
│  │  (数据缓存)  │ │  (UI 状态)  │ │      (筛选状态)          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
         │                   │                   │
         ▼                   ▼                   ▼
   ┌──────────┐       ┌──────────┐       ┌──────────────┐
   │ employees│       │currentTab│       │selectedDepts │
   │  tasks   │       │isLoading │       │searchQuery   │
   │  stats   │       │lastError │       │sortBy        │
   │timestamp │       │animations│       │viewMode      │
   └──────────┘       └──────────┘       └──────────────┘
```

### 3.2 Store 实现模式

```javascript
// 自定义轻量级 Store (基于发布-订阅模式)
class LinglongStore {
  constructor() {
    this.state = {
      // 数据层
      data: null,
      loading: false,
      error: null,
      lastUpdate: null,
      
      // UI 层
      currentTab: 'employees',
      isRefreshing: false,
      
      // 筛选层
      filters: {
        departments: [],      // 选中的部门
        status: 'all',        // all | working | idle
        searchQuery: ''       // 搜索关键词
      }
    };
    
    this.listeners = new Set();
    this.computedCache = new Map();
  }
  
  // 状态变更 (同步)
  commit(mutation, payload) {
    const prevState = { ...this.state };
    
    switch(mutation) {
      case 'SET_DATA':
        this.state.data = payload;
        this.state.lastUpdate = new Date();
        break;
      case 'SET_LOADING':
        this.state.loading = payload;
        break;
      case 'SET_TAB':
        this.state.currentTab = payload;
        break;
      case 'SET_FILTER':
        this.state.filters = { ...this.state.filters, ...payload };
        this.invalidateCache();
        break;
    }
    
    this.notify(prevState);
  }
  
  // 计算属性 (带缓存)
  getter(name, computeFn) {
    if (!this.computedCache.has(name)) {
      this.computedCache.set(name, computeFn(this.state));
    }
    return this.computedCache.get(name);
  }
  
  // 订阅变更
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  notify(prevState) {
    this.listeners.forEach(fn => fn(this.state, prevState));
  }
}

// 单例导出
window.llStore = new LinglongStore();
```

### 3.3 状态派生规则

| 派生状态 | 依赖 | 计算逻辑 |
|----------|------|----------|
| `onlineCount` | `employees` | `employees.filter(e => e.status === 'working').length` |
| `deptStats` | `employees` | 按部门分组统计在线/总数 |
| `filteredEmployees` | `employees` + `filters` | 应用部门/状态/搜索筛选 |
| `activeTasks` | `tasks` | `tasks.filter(t => t.priority !== 'low')` |
| `isDataStale` | `lastUpdate` | `Date.now() - lastUpdate > 60000` |

---

## 4. 组件通信机制

### 4.1 组件架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                          App (根组件)                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     HeaderComponent                            │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐  │  │
│  │  │   Logo      │ │ StatusBadge │ │    RefreshButton        │  │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     TabContainerComponent                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │  │
│  │  │ Tab:员工 │ │ Tab:任务 │ │ Tab:统计 │                       │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘                       │  │
│  │       │            │            │                              │  │
│  │       ▼            ▼            ▼                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │  │
│  │  │ Employee │ │  Task    │ │  Stats   │                       │  │
│  │  │  Grid    │ │   List   │ │  Charts  │                       │  │
│  │  └──────────┘ └──────────┘ └──────────┘                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                  ParticleBackground                            │  │
│  │              (Canvas 粒子动画背景)                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 通信模式

#### 模式一：Props Down (属性传递)
```javascript
// 父组件向子组件传递数据
class EmployeeGridComponent {
  constructor(container, props) {
    this.container = container;
    this.employees = props.employees;  // 从父组件接收
    this.filters = props.filters;
  }
  
  render() {
    const filtered = this.applyFilters(this.employees);
    this.container.innerHTML = filtered.map(emp => 
      `<employee-card data='${JSON.stringify(emp)}'></employee-card>`
    ).join('');
  }
}
```

#### 模式二：Events Up (事件冒泡)
```javascript
// 子组件向父组件发送事件
class RefreshButtonComponent {
  constructor(container) {
    this.container = container;
    this.onClick = null;  // 回调函数
  }
  
  render() {
    this.container.innerHTML = `
      <button class="refresh-btn">
        <span class="refresh-icon">🔄</span>
        <span>刷新</span>
      </button>
    `;
    
    this.container.querySelector('button').addEventListener('click', () => {
      // 触发父组件回调
      if (this.onClick) this.onClick();
      
      // 或触发自定义事件
      this.container.dispatchEvent(new CustomEvent('refresh', {
        bubbles: true
      }));
    });
  }
}
```

#### 模式三：Store 订阅 (全局状态)
```javascript
// 组件订阅 Store 变更
class StatsCardComponent {
  constructor(container) {
    this.container = container;
    
    // 订阅全局状态
    this.unsubscribe = store.subscribe((state, prevState) => {
      if (state.data !== prevState.data) {
        this.update(state.data.stats);
      }
    });
  }
  
  update(stats) {
    // 动画更新数值
    animateValue(this.container.querySelector('.value'), stats.online);
  }
  
  destroy() {
    this.unsubscribe();  // 清理订阅
  }
}
```

### 4.3 事件总线 (用于跨层级通信)

```javascript
// 轻量级事件总线
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

window.llBus = new EventBus();

// 使用示例
// 筛选组件
llBus.on('filter:changed', (filters) => {
  store.commit('SET_FILTER', filters);
});

// 员工卡片点击
llBus.emit('employee:selected', { id: 'lingma', name: '灵码' });
```

---

## 5. 核心功能实现

### 5.1 实时数据更新 (30秒刷新)

```javascript
class DataRefreshService {
  constructor(store) {
    this.store = store;
    this.intervalId = null;
    this.refreshInterval = 30000;  // 30秒
    this.retryDelay = 5000;        // 失败重试5秒
    this.maxRetries = 3;
  }
  
  async fetchData(retryCount = 0) {
    try {
      const cacheBuster = `t=${Date.now()}`;
      const response = await fetch(`linglong-data.json?${cacheBuster}`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      this.store.commit('SET_DATA', data);
      this.store.commit('SET_ERROR', null);
      
      return data;
    } catch (error) {
      console.error('Data fetch failed:', error);
      
      if (retryCount < this.maxRetries) {
        setTimeout(() => this.fetchData(retryCount + 1), this.retryDelay);
      } else {
        this.store.commit('SET_ERROR', error);
      }
    }
  }
  
  start() {
    // 立即执行一次
    this.fetchData();
    
    // 定时刷新
    this.intervalId = setInterval(() => {
      this.fetchData();
    }, this.refreshInterval);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  // 页面可见性变化时智能处理
  handleVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
      this.fetchData();  // 恢复时立即刷新
    }
  }
}
```

### 5.2 部门筛选状态管理

```javascript
class FilterManager {
  constructor(store) {
    this.store = store;
    this.departments = ['中枢', '情报', '开发', '文档', '视觉', '演示', '安卫'];
  }
  
  // 切换部门筛选
  toggleDepartment(dept) {
    const current = this.store.state.filters.departments;
    const updated = current.includes(dept)
      ? current.filter(d => d !== dept)
      : [...current, dept];
    
    this.store.commit('SET_FILTER', { departments: updated });
  }
  
  // 设置状态筛选
  setStatusFilter(status) {
    this.store.commit('SET_FILTER', { status });
  }
  
  // 设置搜索关键词
  setSearchQuery(query) {
    this.store.commit('SET_FILTER', { searchQuery: query });
  }
  
  // 获取筛选后的员工
  getFilteredEmployees() {
    const { employees } = this.store.state.data || {};
    const { departments, status, searchQuery } = this.store.state.filters;
    
    if (!employees) return [];
    
    return employees.filter(emp => {
      // 部门筛选
      if (departments.length > 0 && !departments.includes(emp.dept)) {
        return false;
      }
      
      // 状态筛选
      if (status !== 'all' && emp.status !== status) {
        return false;
      }
      
      // 搜索筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = emp.name.toLowerCase().includes(query);
        const matchRole = emp.role.toLowerCase().includes(query);
        if (!matchName && !matchRole) return false;
      }
      
      return true;
    });
  }
}
```

### 5.3 员工状态动画 (呼吸灯效果)

```css
/* 呼吸灯动画定义 */
@keyframes breathing-glow {
  0%, 100% {
    box-shadow: 0 0 5px var(--status-color),
                0 0 10px var(--status-color),
                0 0 15px var(--status-color);
    opacity: 1;
  }
  50% {
    box-shadow: 0 0 10px var(--status-color),
                0 0 20px var(--status-color),
                0 0 30px var(--status-color);
    opacity: 0.8;
  }
}

/* 工作状态指示器 */
.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  --status-color: var(--ll-success);
}

.status-indicator--working {
  background: var(--ll-success);
  animation: breathing-glow 2s ease-in-out infinite;
}

.status-indicator--idle {
  background: var(--ll-text-subtle);
  /* 无动画 */
}
```

```javascript
// 员工卡片组件
class EmployeeCardComponent {
  render(employee) {
    const deptConfig = DEPARTMENTS[employee.dept];
    const statusClass = employee.status === 'working' ? 'status-indicator--working' : 'status-indicator--idle';
    
    return `
      <div class="ll-employee-card" data-employee-id="${employee.id}">
        <div class="ll-employee-avatar dept-${deptConfig.key}">
          ${employee.avatar}
        </div>
        <div class="ll-employee-info">
          <div class="ll-employee-name">${employee.name}</div>
          <div class="ll-employee-role">${employee.role} · ${employee.dept}</div>
          <span class="ll-employee-status">
            <span class="status-indicator ${statusClass}"></span>
            ${employee.status === 'working' ? '工作中' : '空闲'}
          </span>
        </div>
      </div>
    `;
  }
}
```

### 5.4 动态 Feed 流

```javascript
class FeedStreamManager {
  constructor(container, store) {
    this.container = container;
    this.store = store;
    this.maxItems = 50;  // 最大保留条目
    this.feedItems = [];
  }
  
  // 添加 Feed 项
  addFeedItem(type, data) {
    const item = {
      id: Date.now() + Math.random(),
      type,  // 'status-change' | 'task-update' | 'system'
      data,
      timestamp: new Date()
    };
    
    this.feedItems.unshift(item);
    
    // 限制数量
    if (this.feedItems.length > this.maxItems) {
      this.feedItems = this.feedItems.slice(0, this.maxItems);
    }
    
    this.renderItem(item, true);  // true = 动画插入
  }
  
  // 从数据变更生成 Feed
  generateFeedsFromDiff(prevData, newData) {
    // 检测员工状态变化
    if (prevData?.employees && newData?.employees) {
      const prevMap = new Map(prevData.employees.map(e => [e.id, e]));
      
      newData.employees.forEach(emp => {
        const prev = prevMap.get(emp.id);
        if (prev && prev.status !== emp.status) {
          this.addFeedItem('status-change', {
            employee: emp,
            from: prev.status,
            to: emp.status
          });
        }
      });
    }
    
    // 检测新任务
    if (prevData?.tasks && newData?.tasks) {
      const prevTaskTitles = new Set(prevData.tasks.map(t => t.title));
      newData.tasks.forEach(task => {
        if (!prevTaskTitles.has(task.title)) {
          this.addFeedItem('task-update', { task, action: 'created' });
        }
      });
    }
  }
  
  renderItem(item, animate = false) {
    const html = this.createFeedHTML(item);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    
    if (animate) {
      wrapper.firstElementChild.classList.add('feed-item--entering');
    }
    
    this.container.insertBefore(wrapper.firstElementChild, this.container.firstChild);
  }
}
```

### 5.5 响应式布局

```css
/* 断点定义 */
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* 移动端优先设计 */
.ll-container {
  padding: 16px;
  max-width: 100%;
}

/* 统计卡片网格 */
.ll-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 移动端2列 */
  gap: 12px;
}

/* 员工网格 */
.ll-employees-grid {
  display: grid;
  grid-template-columns: 1fr;  /* 移动端单列 */
  gap: 12px;
}

/* 平板端 */
@media (min-width: 768px) {
  .ll-container {
    padding: 24px;
  }
  
  .ll-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .ll-employees-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面端 */
@media (min-width: 1024px) {
  .ll-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 32px;
  }
  
  .ll-stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  .ll-employees-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

/* 大屏 */
@media (min-width: 1280px) {
  .ll-employees-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 6. 模块依赖关系

```
┌────────────────────────────────────────────────────────────────────┐
│                           入口文件                                  │
│                         index.html                                 │
└────────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ css-variables│      │ components.css│      │  app.js      │
│   .css       │      │   .css       │      │  (主逻辑)     │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                   │
                          ┌────────────────────────┼────────────────────────┐
                          │                        │                        │
                          ▼                        ▼                        ▼
                   ┌────────────┐          ┌────────────┐          ┌────────────┐
                   │  Store     │          │ Components │          │ Services   │
                   │  Module    │          │  Module    │          │  Module    │
                   └─────┬──────┘          └─────┬──────┘          └─────┬──────┘
                         │                       │                       │
       ┌─────────────────┘                       │                       │
       │                                         │                       │
       ▼                                         ▼                       ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │  ┌────────────┐ ┌────────────┐
│  State      │  │  Mutations  │  │  Getters    │ │  │ Header     │ │ DataService│
│  (state)    │  │  (commit)   │  │  (computed) │ │  │ StatsGrid  │ │ FilterMgr  │
└─────────────┘  └─────────────┘  └─────────────┘ │  │ Employee   │ │ FeedStream │
                                                  │  │   Grid     │ │ Particle   │
                                                  │  │ TaskList   │ │   Anim     │
                                                  │  └────────────┘ └────────────┘
                                                  │
                                                  ▼
                                           ┌────────────┐
                                           │  Utils     │
                                           │  Module    │
                                           └─────┬──────┘
                                                 │
                    ┌────────────────────────────┼────────────────────────────┐
                    │                            │                            │
                    ▼                            ▼                            ▼
             ┌────────────┐              ┌────────────┐              ┌────────────┐
             │ Animations │              │  Helpers   │              │   Config   │
             │  (animate) │              │ (debounce) │              │   (const)  │
             └────────────┘              └────────────┘              └────────────┘
```

---

## 7. 文件组织

```
stepclaw-dashboard/
├── index.html                 # 主入口文件
├── linglong-v2.html          # v2.0 完整实现
├── linglong-data.json        # 数据文件 (GitHub Actions生成)
├── css-variables.css         # CSS 变量/设计令牌
├── components.css            # 组件样式
├── js/
│   ├── app.js               # 应用入口
│   ├── store.js             # 状态管理
│   ├── components.js        # 组件定义
│   ├── services.js          # 数据服务
│   └── utils.js             # 工具函数
├── .github/
│   └── workflows/
│       └── update-data.yml  # 数据更新工作流
└── architecture.md          # 本文档
```

---

## 8. 性能优化策略

### 8.1 渲染优化

| 策略 | 实现方式 | 效果 |
|------|----------|------|
| 虚拟滚动 | 仅渲染可视区域员工卡片 | 支持大量数据 |
| 防抖渲染 | 筛选输入防抖 300ms | 减少无效渲染 |
| 批量 DOM 更新 | 使用 DocumentFragment | 减少重排 |
| CSS 动画优先 | 使用 transform/opacity | 启用 GPU 加速 |

### 8.2 数据优化

```javascript
// 数据缓存策略
class DataCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 30000;  // 30秒缓存
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}
```

### 8.3 加载优化

- **CSS**: 关键 CSS 内联，非关键 CSS 异步加载
- **JS**: 模块按需加载，使用 `defer` 属性
- **字体**: 使用系统字体栈，无外部字体依赖
- **图片**: 使用 Emoji 作为头像，无图片资源

---

## 9. 扩展性设计

### 9.1 新增部门

```javascript
// 在 DEPARTMENTS 配置中添加
const DEPARTMENTS = {
  // ... 现有部门
  '运维': { icon: '🔧', color: '#f97316', key: 'ops' }
};

// 样式自动适配 (CSS 变量动态生成)
```

### 9.2 新增视图

```javascript
// 1. 在 Store 中添加状态
store.state.views = ['employees', 'tasks', 'stats', 'timeline'];

// 2. 创建新组件
class TimelineComponent extends BaseComponent {
  render() {
    // 实现时间线视图
  }
}

// 3. 注册到 TabContainer
```

### 9.3 插件机制

```javascript
// 插件接口
class PluginManager {
  constructor() {
    this.plugins = [];
  }
  
  register(plugin) {
    this.plugins.push(plugin);
    plugin.install({ store, bus, components });
  }
}

// 示例插件：深色模式切换
const DarkModePlugin = {
  install({ store }) {
    store.subscribe((state) => {
      document.body.classList.toggle('dark', state.darkMode);
    });
  }
};
```

---

## 10. 部署架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                           开发者本地                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐  │
│  │  代码编辑   │───►│  git commit │───►│   git push origin main  │  │
│  └─────────────┘    └─────────────┘    └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         GitHub Repository                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  main 分支: 源代码 (HTML/CSS/JS)                              │  │
│  │  gh-pages 分支: 构建产物 (GitHub Pages 部署)                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────────────────┐
│    GitHub Actions       │    │           GitHub Pages              │
│  ┌───────────────────┐  │    │  ┌───────────────────────────────┐  │
│  │  .github/workflows│  │    │  │  静态站点托管                  │  │
│  │  /update-data.yml │  │    │  │  - index.html                 │  │
│  └───────────────────┘  │    │  │  - linglong-data.json (每2min)│  │
│                         │    │  │  - CSS/JS 资源                │  │
│  触发条件:              │    │  └───────────────────────────────┘  │
│  - 每2分钟定时触发      │    │                                     │
│  - 手动触发             │    │  访问地址:                          │
│                         │    │  https://user.github.io/            │
│  任务:                  │    │  /stepclaw-dashboard                │
│  - 生成 linglong-data   │    │                                     │
│    .json                │    │  CDN: 全球加速                      │
│  - 提交到 gh-pages      │    │  HTTPS: 自动证书                    │
└─────────────────────────┘    └─────────────────────────────────────┘
```

---

## 11. 总结

### 11.1 架构亮点

1. **极简架构**: 纯前端实现，零后端依赖，部署简单
2. **响应式设计**: 从移动端到桌面端完美适配
3. **状态管理**: 自定义轻量级 Store，满足需求无过度设计
4. **组件化**: 清晰的组件边界，易于维护和扩展
5. **性能优先**: 虚拟滚动、防抖、缓存等多重优化

### 11.2 技术债务

| 项目 | 说明 | 建议 |
|------|------|------|
| 无类型系统 | 使用原生 JS，无 TypeScript | 可考虑 JSDoc 类型注释 |
| 无测试框架 | 缺少单元测试和 E2E 测试 | 可引入 Jest + Playwright |
| 硬编码配置 | 部门、员工信息硬编码 | 可提取到配置文件 |

### 11.3 后续演进方向

1. **v2.1**: 引入 TypeScript，增强类型安全
2. **v2.2**: 添加 WebSocket 支持，实现真正实时推送
3. **v3.0**: 引入 Vue/React 框架，支持更复杂的交互

---

*文档结束*
