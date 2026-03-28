# 灵笼看板 v2.0 问题列表

## 📋 问题概览

| 严重级别 | 数量 | 状态 |
|---------|-----|------|
| 🔴 Critical (严重) | 0 | - |
| 🟡 Major (主要) | 3 | 待修复 |
| 🟢 Minor (轻微) | 2 | 建议优化 |
| **总计** | **5** | - |

---

## 🔴 严重问题 (Critical)

暂无

---

## 🟡 主要问题 (Major)

### BUG-F001: 默认数据随机状态不一致

| 属性 | 内容 |
|------|------|
| **问题ID** | BUG-F001 |
| **问题类型** | 功能缺陷 |
| **严重程度** | Major |
| **发现日期** | 2026-03-28 |
| **发现者** | 灵测 |
| **状态** | 🔴 待修复 |
| **所属模块** | 数据加载 |
| **影响版本** | v2.0 |

#### 问题描述
当 `linglong-data.json` 加载失败时，系统使用默认数据渲染。但默认数据中的员工状态使用 `Math.random()` 生成，导致每次刷新页面时员工状态都不同，给用户造成困惑。

#### 复现步骤
1. 断开网络连接或删除 `linglong-data.json`
2. 刷新页面
3. 观察员工状态
4. 再次刷新页面
5. 观察员工状态变化

#### 实际结果
每次刷新员工状态随机变化（working/idle）

#### 预期结果
默认数据应该是固定的，保持一致性

#### 相关代码
```javascript
// linglong-v2.html 第~380行
const data = employeeData || EMPLOYEES.map((e, i) => ({
    ...e,
    status: Math.random() > 0.3 ? 'working' : 'idle',  // ❌ 随机生成
    task: Math.random() > 0.3 ? '处理中...' : '待命'
}));
```

#### 修复建议
使用固定的默认状态数据：
```javascript
const DEFAULT_EMPLOYEE_STATES = {
    'lingshu': { status: 'working', task: '任务调度' },
    'lingmou': { status: 'working', task: '情报收集' },
    // ... 其他员工固定状态
};
```

#### 优先级
P1 - 影响用户体验

---

### BUG-C001: Firefox粒子性能下降

| 属性 | 内容 |
|------|------|
| **问题ID** | BUG-C001 |
| **问题类型** | 性能问题 |
| **严重程度** | Major |
| **发现日期** | 2026-03-28 |
| **发现者** | 灵测 |
| **状态** | 🔴 待修复 |
| **所属模块** | 视觉效果 |
| **影响版本** | v2.0 |
| **影响浏览器** | Firefox |

#### 问题描述
在Firefox浏览器中，粒子动画效果帧率明显低于Chrome/Safari，约为30fps，影响用户体验。

#### 复现步骤
1. 使用Firefox 121+ 打开页面
2. 打开开发者工具 > 性能面板
3. 观察粒子动画帧率

#### 实际结果
帧率约30fps，动画不够流畅

#### 预期结果
帧率应保持在55-60fps

#### 根因分析
Firefox的Canvas 2D渲染性能相对较弱，特别是在处理大量粒子时。

#### 修复建议
1. **浏览器检测降级**：
```javascript
function initParticles() {
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    const particleCount = isFirefox ? 15 : 30;  // Firefox减少粒子数
    // ...
}
```

2. **提供开关**：添加粒子效果开关，用户可手动关闭

3. **使用CSS动画替代**：对于简单效果，使用CSS动画替代Canvas

#### 优先级
P2 - 特定浏览器问题

---

### BUG-P001: 粒子算法O(n²)复杂度

| 属性 | 内容 |
|------|------|
| **问题ID** | BUG-P001 |
| **问题类型** | 性能问题 |
| **严重程度** | Major |
| **发现日期** | 2026-03-28 |
| **发现者** | 灵测 |
| **状态** | 🔴 待修复 |
| **所属模块** | 视觉效果 |
| **影响版本** | v2.0 |

#### 问题描述
粒子连接线计算使用双重循环，时间复杂度为O(n²)。当粒子数量增加时，性能急剧下降。

#### 相关代码
```javascript
// linglong-v2.html 第~450行
// 连接线 - 双重循环 O(n²)
particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // ...
    });
});
```

#### 性能数据
| 粒子数 | 计算次数 | 预估FPS |
|-------|---------|--------|
| 30 | 435 | 55-60 |
| 50 | 1225 | 45-50 |
| 100 | 4950 | 30-35 |

#### 修复建议
1. **空间分割算法**：使用四叉树或网格分割，将复杂度降至O(n log n)或O(n)

2. **距离限制优化**：提前退出远距离粒子计算
```javascript
// 优化版本
const MAX_DIST = 150;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST;

particles.forEach((p1, i) => {
    for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        // 提前检查X轴距离
        if (Math.abs(dx) > MAX_DIST) continue;
        const dy = p1.y - p2.y;
        // 提前检查Y轴距离
        if (Math.abs(dy) > MAX_DIST) continue;
        const distSq = dx * dx + dy * dy;
        if (distSq > MAX_DIST_SQ) continue;
        // 绘制连接线
    }
});
```

3. **帧率自适应**：根据实际帧率动态调整粒子数量

#### 优先级
P1 - 性能瓶颈

---

## 🟢 轻微问题 (Minor)

### BUG-R001: 移动端粒子耗电

| 属性 | 内容 |
|------|------|
| **问题ID** | BUG-R001 |
| **问题类型** | 性能/体验 |
| **严重程度** | Minor |
| **发现日期** | 2026-03-28 |
| **发现者** | 灵测 |
| **状态** | 🟡 建议优化 |
| **所属模块** | 视觉效果 |
| **影响版本** | v2.0 |
| **影响设备** | 移动设备 |

#### 问题描述
粒子效果在移动设备上持续运行，消耗电池电量。Canvas动画会阻止GPU进入低功耗状态。

#### 修复建议
1. **移动端禁用粒子**：
```javascript
function initParticles() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;  // 移动端不初始化粒子
    // ...
}
```

2. **电池状态检测**：
```javascript
if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
        if (battery.level < 0.2 || !battery.charging) {
            // 低电量或未充电时禁用粒子
        }
    });
}
```

3. **页面可见性API**：页面不可见时暂停动画
```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 暂停动画
    } else {
        // 恢复动画
    }
});
```

#### 优先级
P2 - 体验优化

---

### A11Y-001: 缺少ARIA标签

| 属性 | 内容 |
|------|------|
| **问题ID** | A11Y-001 |
| **问题类型** | 可访问性 |
| **严重程度** | Minor |
| **发现日期** | 2026-03-28 |
| **发现者** | 灵测 |
| **状态** | 🟡 建议优化 |
| **所属模块** | 全站 |
| **影响版本** | v2.0 |

#### 问题描述
页面缺少ARIA标签，影响屏幕阅读器用户的体验。

#### 缺失项
1. 标签页缺少 `role="tablist"` / `role="tab"` / `role="tabpanel"`
2. 按钮缺少 `aria-label`
3. 状态指示器缺少 `aria-live`
4. 加载状态缺少 `role="status"`

#### 修复建议
```html
<!-- 标签页 -->
<div class="ll-tabs" role="tablist">
    <button class="ll-tab ll-tab--active" role="tab" aria-selected="true" aria-controls="tab-employees">
        👥 员工状态
    </button>
    <!-- ... -->
</div>

<!-- 刷新按钮 -->
<button class="ll-btn ll-btn--primary refresh-btn" onclick="loadData()" aria-label="刷新数据">
    <span class="refresh-icon" aria-hidden="true">🔄</span>
    <span>刷新</span>
</button>

<!-- 加载状态 -->
<div id="employees-loading" class="ll-loading" role="status" aria-live="polite">
    <div class="ll-loading-spinner"></div>
    <div class="ll-loading-text">连接灵笼数据中心...</div>
</div>
```

#### 优先级
P3 - 可访问性改进

---

## 📈 问题趋势

```
严重级别分布:
🔴 Critical:  0 (0%)
🟡 Major:     3 (60%)
🟢 Minor:     2 (40%)

模块分布:
视觉效果:  3 (60%)
数据加载:  1 (20%)
全站:      1 (20%)

状态分布:
🔴 待修复:  3 (60%)
🟡 建议优化: 2 (40%)
```

---

## 🛠️ 修复计划

### Sprint 1 (高优先级)
- [ ] BUG-F001: 修复默认数据随机状态问题
- [ ] BUG-P001: 优化粒子算法性能

### Sprint 2 (中优先级)
- [ ] BUG-C001: Firefox粒子性能降级
- [ ] BUG-R001: 移动端禁用粒子

### Backlog (低优先级)
- [ ] A11Y-001: 添加ARIA标签支持

---

## 📝 更新日志

| 日期 | 版本 | 更新内容 |
|------|-----|---------|
| 2026-03-28 | v1.0 | 初始问题列表创建 |

---

**文档版本**: v1.0  
**创建日期**: 2026-03-28  
**维护者**: 灵测
