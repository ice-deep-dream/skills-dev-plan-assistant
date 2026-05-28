# 阶段三：回顾 — Bug / 测试 / 总结

> 本文档整合了 [ai-dev-assistant](https://github.com/ice-deep-dream/skills-ai-dev-assistant) 的回顾文档机制。

## 触发规则

| 文档类型 | 触发场景 | 触发方式 |
|----------|----------|----------|
| Bug 文档 | 用户明确要求（如「记录这个 bug」） | **按需**触发 |
| 测试文档 | 用户明确要求（如「记录测试」） | **按需**触发 |
| 总结文档 | 用户明确要求（如「总结一下」「复盘」） | **按需**触发 |

**重要**：默认不创建任何回顾文档，除非用户明确要求。

---

## Bug 文档

### 触发词
- 「记录这个 bug」「创建 bug 文档」
- 「这个 bug 需要跟踪」

### 文档模板
```markdown
---
title: Bug 标题
description: Bug 描述
category: bug
priority: high | medium | low
status: open | in-progress | resolved
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Bug: 标题

## 现象
<!-- bug 的外在表现 -->

## 复现步骤
1. 步骤 1
2. 步骤 2
3. 步骤 3

## 预期结果
<!-- 应该发生什么 -->

## 实际结果
<!-- 实际发生了什么 -->

## 根因分析
<!-- 找到原因后填写 -->

## 修复方案
<!-- 修复方法 -->

## 影响范围
<!-- 影响哪些模块/功能 -->
```

### 命名格式
`BUG-序号-标题.md`，例如 `BUG-001-登录页面报错.md`

### 写入位置
`docs/06-项目跟踪/bugs/`

---

## 测试文档

### 触发词
- 「记录测试」「创建测试文档」
- 「跑一下测试」

### 文档模板
```markdown
---
title: 测试名称
description: 测试描述
category: test
testType: unit | integration | e2e
module: 模块名称
status: passed | failed | skipped
created: YYYY-MM-DD
---

# 测试: 名称

## 测试范围
<!-- 哪些功能被覆盖 -->

## 测试用例

### 用例 1: 名称
- **步骤**：
- **预期**：
- **结果**：✅ 通过 / ❌ 失败
- **备注**：

### 用例 2: 名称
- **步骤**：
- **预期**：
- **结果**：
- **备注**：

## 总结
<!-- 通过/失败统计，待改进项 -->
```

### 命名格式
`TEST-序号-名称.md`，例如 `TEST-001-用户登录测试.md`

### 写入位置
`docs/06-项目跟踪/tests/`

---

## 总结文档

### 触发词
- 「总结一下」「做个复盘」
- 「记录一下这次的经验」

### 文档模板
```markdown
---
title: 总结标题
description: 总结描述
category: summary
type: sprint | milestone | retrospective
created: YYYY-MM-DD
---

# 总结: 标题

## 时间范围
YYYY-MM-DD 至 YYYY-MM-DD

## 本阶段完成
- [x] 完成项 1
- [x] 完成项 2

## 未完成
- [ ] 遗留项 1

## 遇到的问题
1. 问题 1 - 解决方案
2. 问题 2 - 解决方案

## 经验教训
- 经验 1
- 经验 2

## 下阶段计划
- 计划 1
- 计划 2
```

### 命名格式
`总结-YYYYMMDD-主题.md`，例如 `总结-20260527-第一期复盘.md`

### 写入位置
`docs/06-项目跟踪/summaries/`

---

## 新增文档后的自动操作

每次在 `docs/06-项目跟踪/` 下新增文档后：
1. 更新 `docs/06-项目跟踪/README.md` 中的索引
2. 更新 `docs/.vuepress/config.js` 的侧边栏配置（如有必要）
