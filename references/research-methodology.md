# 技术调研方法论（阶段一·第二部分）

> 本文档深度借鉴了 [niveku/skill-research-first](https://github.com/niveku/skill-research-first) 的研究方法论。

## 核心原则

**创建前先搜索。** 当你的任务是「构建一个产品/系统/工具」时，最高杠杆的动作是搜索：是否已经有类似的东西？

四种使用现成方案的方式（优先级从高到低）：

1. **直接使用** — 活跃维护的开源项目完全满足需求 → 直接采用
2. **自托管适配** — 项目接近但需小修改，License 允许 → 自托管
3. **Fork 扩展** — 项目接近但缺少功能 → Fork 后扩展（注意 License 兼容性）
4. **参考架构** — 都不合适但可以学习其数据模型和 API 设计

---

## 多层次搜索策略

### 第一层：类似开源项目（产品级任务优先）

当任务是「构建一个 CRM」「做一个 Notion 克隆」「我要一个 dashboard 工具」等产品级需求时，先找类似开源项目。

**Web 搜索语句**：
```
"open source {类别} github"
"self-hosted {产品名}"
"{商业产品} open source alternative"
"{产品类别} like {已知产品} self-hosted"
```

**GitHub 原生搜索**：
- `github.com/topics/{topic}` — 浏览话题
- GitHub 搜索语法：`in:name,description,topics {关键词} stars:>500 pushed:>2026-01-01`
- `github.com/trending` — 热门项目
- `github.com/trending/{语言}?since=monthly` — 每月趋势

**替代品数据库**：
| 资源 | 用途 |
|------|------|
| [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) | 自托管软件清单（15k+ stars） |
| [openalternative.co](https://openalternative.co) | 精选的 SaaS 开源替代 |
| [alternativeto.net](https://alternativeto.net) | 最大替代品数据库（筛选 "Open Source"） |
| [LibHunt](https://www.libhunt.com) | 并排比较开源项目 |
| [privacyguides.org/tools](https://www.privacyguides.org/tools/) | 隐私友好的开源工具 |

**精选列表**：
- [awesome-oss-alternatives](https://github.com/RunaCapital/awesome-oss-alternatives) — OSS 替代 SaaS 商业软件
- [awesome-{topic}](https://github.com/sindresorhus/awesome) — 找到特定领域的 awesome 列表

### 第二层：工具库和框架（组件级任务）

**搜索语句**：
- `"best {工具类型} {语言} 2025 2026"` — 近期推荐
- `"{问题描述} library {语言} github stars:>500"`
- `"awesome-{主题}" github` — 精选列表

**客观指标来源（难以造假）**：
- [npm trends](https://npmtrends.com) — 比较 npm 包流行度
- [PyPI stats](https://pypistats.org) — Python 包下载统计
- [GitHub star history](https://star-history.com) — star 增长趋势
- [Socket.dev](https://socket.dev) — npm/PyPI 安全分析

**论坛（真实用户评价优先于博客）**：
- Reddit：`r/programming`、`r/webdev`、`r/{语言}`
- Hacker News：via `hn.algolia.com`
- Stack Overflow
- GitHub Discussions（项目自己的讨论区）

### 第三层：模板和脚手架

- GitHub 代码搜索：`"boilerplate {技术栈}"`、`"starter {框架}"`
- 官方示例库：Next.js examples、Vercel templates 等
- [free-for.dev](https://github.com/ripienaar/free-for-dev) — 免费开发者服务

---

## 六维评估体系

对于每个候选方案，按以下维度打分：

| 维度 | 检查内容 | 权重 |
|------|----------|------|
| **Activity（活跃度）** | 最近提交 < 6 个月？Issues 有人回复？ | ⭐⭐⭐ |
| **Adoption（采用度）** | Stars > 100？周下载量？被知名项目使用？ | ⭐⭐⭐ |
| **Security（安全性）** | 无未修补 CVE？snyk.io/socket.dev 检查 | ⭐⭐⭐ |
| **License（许可证）** | MIT/Apache 2.0/BSD（安全），GPL/AGPL（copyleft 风险） | ⭐⭐ |
| **Docs（文档）** | README 有使用示例？有 docs site？ | ⭐⭐ |
| **Fit（适配度）** | 与现有技术栈兼容？依赖最小？解决实际问题？ | ⭐⭐⭐ |

### 类似项目的额外检查
- **范围匹配**：解决 80%+ 的问题，不是玩具/demo
- **可自托管**：有 Docker 镜像、部署指南或 Helm chart
- **社区健康**：贡献者 > 5（不是一人项目即将被弃）
- **数据可迁移**：能否导出数据

---

## 反偏见过滤器

许多「Top 10」博客排名自己的产品第一。防护措施：

1. **交叉验证 3+ 独立来源** — 只有一个博客推荐？怀疑
2. **优先客观指标** — Stars、下载量、StackOverflow 问题数
3. **优先中立来源** — Stack Overflow、GitHub trending、npmtrends.com、Reddit/HN 讨论
4. **社区 > 博客** — 开发者会说「我试了 X 太烂了因为...」，博客很少说
5. **有疑问就告诉用户** — 如果最佳来源是产品自己网站，明说

---

## 工作量校准

| 任务类型 | 搜索深度 | 跳过什么 |
|----------|----------|----------|
| 简单任务（修 bug、小功能） | 1 分钟快速搜索 | 多层评估 |
| 明确有库的任务 | 3-5 分钟 | 非相关领域参考 |
| 构建产品/系统/克隆 | 10-15 分钟 | 无 — 强调第一层（类似项目） |
| 复杂或模糊任务 | 完整流程 | 无 — 所有层都跑 |

**搜索时间超过任务本身就是在浪费。**

---

## 推荐呈现格式

```
经过调研，共找到 N 个相关项目：

| 项目 | Stars | 最近更新 | 匹配度 | 许可证 | 结论 |
|------|-------|----------|--------|--------|------|
| project-a | 12k | 3天前 | 90% | MIT | ✅ 推荐直接使用 |
| project-b | 500 | 1年前 | 60% | Apache | 参考其状态管理方案 |
| project-c | 50 | 3年前 | 30% | GPL | ❌ 已过时 |

最终建议：使用 project-a，通过自托管 + 自定义满足需求。
剩余需自行开发：{列出}
```

---

## 什么不该做

- ❌ 跳过搜索直接创建，即使你觉得「肯定没有现成的」
- ❌ 当有类似开源项目时从头构建整个产品
- ❌ 推荐 12 个月以上无提交且有未解决关键 issue 的弃用项目
- ❌ 推荐有未修补 CVE 的库
- ❌ 为一个工具引入整个框架
- ❌ 简单任务上花超过 2-3 分钟搜索
- ❌ 信任单一「Top 10」博客作为唯一来源
- ❌ 对非开发任务使用 GitHub stars 作为指标
