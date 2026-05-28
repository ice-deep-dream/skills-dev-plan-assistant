# 阶段二：开发 — 模块管理

> 本文档整合了 [ai-dev-assistant](https://github.com/ice-deep-dream/skills-ai-dev-assistant) 的模块跟踪机制。

## 触发规则

| 场景 | 行为 | 触发方式 |
|------|------|----------|
| 用户提出新模块需求 | 自动创建开发文档 | 自动 |
| 开发过程中 | 按需更新进度 | 按需 |
| 用户确认模块完成 | 标记 completed | 用户确认后执行 |
| 用户要求记录 | 写入对应文档 | 按需 |

## 默认行为：不主动写文档

开发过程中默认**不创建或修改文档**，除非：
- 模块启动/完成（自动行为）
- 用户明确要求记录
- AI 判断关键信息需要保存（反问确认后写入）

---

## 命令参考

### module-start（模块启动）

**触发**：用户提出新模块需求

**流程**：
1. 确认模块名称、类型、需求描述
2. 参考 `docs/03-模板中心/` 的现有模式，确保新模块遵循项目已有写法
3. 输出开发计划概要
4. 用户确认后，创建开发文档到 `docs/04-开发计划/`

**参数**：
- `moduleName`：模块名称
- `moduleType`：frontend / backend / fullstack / tool
- `description`：模块描述
- `requirements`：需求列表
- `plan`：开发计划概要
- `owner`：负责人

**文档格式**：
```markdown
---
title: 模块名称
module: 模块代码
status: planning
progress: 0
priority: high
owner: 负责人
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# 模块名称

## 概述
...

## 需求列表
- [ ] 需求 1
- [ ] 需求 2

## 技术方案
...

## 接口定义
...
```

### module-update（模块更新）

**触发**：开发过程中需要更新进度

**流程**：
1. 更新文档的 frontmatter（status、progress、updated）
2. 更新对应的内容章节
3. 更新 `docs/04-开发计划/README.md` 中的进度表格

### module-complete（模块完成）

**触发**：用户确认模块完成

**流程**：
1. 更新 status 为 `completed`，progress 为 `100`
2. 更新进度总览表
3. 可选：记录完成总结

---

## 进度总览表格式

`docs/04-开发计划/README.md` 中维护：

| 模块 | 状态 | 进度 | 负责人 | 依赖 |
|------|------|------|--------|------|
| 用户认证 | 🟡 developing | 60% | - | - |
| 数据管理 | ⬜ planning | 0% | - | 用户认证 |

---

## 文档命名规范

- 开发文档：`001-模块名称开发.md`
- 文件写入 `docs/04-开发计划/`
