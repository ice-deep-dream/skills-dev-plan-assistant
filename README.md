# dev-plan-assistant

<p align="center">
  <a href="./README.md">中文</a> | <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/Platform-Claude%20Code%20%7C%20WorkBuddy%20%7C%20Trae-green" alt="Platform" />
</p>

>全生命周期开发助手 —覆盖「规划 → 开发 → 回顾」完整闭环

---

## 功能

|阶段 | 内容 | 触发 |
|:----:|:-----|:----:|
| **规划** | 反问需求 → GitHub 调研 → 扫描模板 → 生成站点 | 自动 |
| **开发** | 模块启动/更新/完成，一个模块一个计划 | 自动 |
| **回顾** | Bug/测试/总结文档 | 按需 |

---

## 安装

```bash
# WorkBuddy
cp -r dev-plan-assistant ~/.workbuddy/skills/

# Claude Code
cp -r dev-plan-assistant ~/.claude/skills/

# 其他 AI 助手
将 SKILL.md 目录复制到对应 skills 目录
```

---

## 使用

安装后无需手动调用。说「我要做一个 XXX」时自动启动。

```
你: 我要做一个剪切板工具

AI: [自动启动]
    先确认：核心功能、技术栈、目标用户...
    [搜索 GitHub] 找到 CopyQ、Ditto...
    结论：暂无完全匹配，从零开发
    [生成 VuePress 站点]
    运行 npm run docs:dev 预览
```

---

## 目录结构

```
dev-plan-assistant/
├── SKILL.md                # 核心指令
├── references/             # 流程参考
│   ├── phase1-planning.md
│   ├── research-methodology.md
│   ├── phase1-template.md
│   ├── phase2-development.md
│   └── phase3-review.md
└── assets/
    └── vuepress-template/  # VuePress 站点模板
```

---

## 致谢

- [skills-ai-dev-assistant](https://github.com/ice-deep-dream/skills-ai-dev-assistant)
- [skill-research-first](https://github.com/niveku/skill-research-first)

---

## 许可证

MIT