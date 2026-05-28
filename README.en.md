# dev-plan-assistant

<p align="center">
  <a href="./README.md">中文</a> | <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/Platform-Claude%20Code%20%7C%20WorkBuddy%20%7C%20Trae-green" alt="Platform" />
</p>

> Full-lifecycle development assistant — covering「Plan → Develop → Review」

---

## Features

| Phase | Content | Trigger |
|:----:|:-------|:-------:|
| **Plan** | Clarify needs → GitHub research → Scan templates → Generate site | Auto |
| **Develop** | Module start/update/complete, one plan per module | Auto |
| **Review** | Bug/Test/Summary docs | On-demand |

---

## Install

```bash
# WorkBuddy
cp -r dev-plan-assistant ~/.workbuddy/skills/

# Claude Code
cp -r dev-plan-assistant ~/.claude/skills/

# Other AI assistants
Copy SKILL.md directory to corresponding skills folder
```

---

## Usage

Auto-activates when you say「I want to build XXX」.

```
You: I want to build a clipboard tool

AI: [Auto-activates]
    Clarify: core features, tech stack, target users...
    [Search GitHub] Found CopyQ, Ditto...
    Conclusion: No perfect match, build from scratch
    [Generate VuePress site]
    Run npm run docs:dev to preview
```

---

## Structure

```
dev-plan-assistant/
├── SKILL.md                # Core instructions
├── references/             # Process references
│   ├── phase1-planning.md
│   ├── research-methodology.md
│   ├── phase1-template.md
│   ├── phase2-development.md
│   └── phase3-review.md
└── assets/
    └── vuepress-template/  # VuePress site template
```

---

## Credits

- [skills-ai-dev-assistant](https://github.com/ice-deep-dream/skills-ai-dev-assistant)
- [skill-research-first](https://github.com/niveku/skill-research-first)

---

## License

MIT