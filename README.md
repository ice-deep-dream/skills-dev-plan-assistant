# dev-plan-assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-FE5196?logo=conventionalcommits)](https://www.conventionalcommits.org/)

全生命周期开发助手 — AI Agent Skill，覆盖「规划 → 开发 → 回顾」完整闭环。

## 做什么

开发前帮你想清楚、搜一遍、写出计划；开发中自动跟踪模块进度；开发后按需记录复盘。

| 阶段 | 内容 | 触发 |
|------|------|------|
| **阶段一：规划** | 反问需求 → GitHub 调研 → 扫描模板 → 生成计划站点 | 自动 |
| **阶段二：开发** | 模块启动/更新/完成，一个模块一个计划 | 自动 |
| **阶段三：回顾** | Bug/测试/总结文档 | 按需 |

## 安装

### WorkBuddy

```bash
cp -r dev-plan-assistant ~/.workbuddy/skills/
```

### Claude Code

```bash
cp -r dev-plan-assistant ~/.claude/skills/
```

### Trae / Cursor / 其他

将 `SKILL.md` 所在目录复制到对应 AI 助手的 skills 目录即可。

## 使用

安装后无需手动调用。当你说「我要做一个 XXX」或提出新模块需求时，skill 自动启动。

**典型对话：**

```
你: 我要做一个 Windows 剪切板工具
AI: [自动启动 dev-plan-assistant]
    先确认几个问题：核心功能、技术栈、目标用户...
    [确认后] 需求已确认，接下来搜索 GitHub 看有没有现成的方案...
    [搜索完成] 找到 3 个相关项目：CopyQ (70%)、Ditto (75%)、clipboard-rs (30%)
    结论：暂无完全匹配的方案，从零开发合理
    [扫描项目模板...]
    [生成 VuePress 站点...]
    站点已生成，运行 npm run docs:dev 预览
```

## 目录结构

```
dev-plan-assistant/
├── SKILL.md                        # 核心指令（跨 AI 平台兼容）
├── references/
│   ├── phase1-planning.md          # 阶段一：需求理解 + 调研 + 模板扫描
│   ├── research-methodology.md     # 技术调研方法论（多层次搜索 + 六维评估）
│   ├── phase1-template.md          # 扫描项目生成模板
│   ├── phase2-development.md       # 阶段二：模块管理
│   └── phase3-review.md            # 阶段三：回顾文档
└── assets/
    └── vuepress-template/          # VuePress 站点模板
        ├── package.json
        └── docs/                   # 六大分区文档骨架
```

## 借鉴与致谢

- [skills-ai-dev-assistant](https://github.com/ice-deep-dream/skills-ai-dev-assistant) — 开发跟踪机制
- [skill-research-first](https://github.com/niveku/skill-research-first) — 研究先行方法论

## License

MIT
