# 阶段一·1.3：扫描项目生成模板

> 在制定开发计划之前，先扫描项目现有代码，提取已有模式做成模板文档。
> 这不是代码规范，而是「项目已经怎么做的」快照。新模块开发时直接参照，避免一人一个写法。

## 核心理念

**模板服务于项目** — 从现有代码中提取，不是凭空定义。如果项目还没有代码（全新项目），跳过这一步。

## 输出格式

**前端/后端各一个完整文档**，不拆分为多个小文件：

| 文档 | 内容 |
|------|------|
| `前端开发模板.md` | 技术栈 + 目录结构 + 路由模式 + Feature模块结构 + API调用模式 + 状态管理模式 + 编码规范 + 新增模块Checklist |
| `后端开发模板.md` | 技术栈 + 目录结构 + 分层架构 + Entity模板 + DTO/VO模板 + Mapper模板 + Service模板 + Controller模板 + 统一响应与异常 + 数据库规范 + 编码规范 + 新增模块Checklist |

---

## 执行时机

- **老项目加新功能**：必须扫描，确保新模块风格一致
- **全新项目**：跳过，没有代码可扫
- **项目刚初始化**：项目骨架已有但模块不多时，建议跑一次

---

## 扫描内容

### 前端项目

| 扫描项 | 查找方式 | 写入模板章节 |
|--------|----------|-------------|
| 技术栈 | 读取 `package.json` dependencies | 一、技术栈 |
| 目录结构 | 遍历 `src/` 目录树 | 二、目录结构 |
| 路由模式 | 搜索 `router`、`createRouter`、路由配置 | 三、路由模式 |
| Feature模块结构 | 搜索 `features/` 或 `pages/` 典型写法 | 四、Feature模块结构 |
| API 调用方式 | 搜索 `axios`、`fetch`、`request` 封装文件 | 五、API调用模式 |
| Store 结构 | 搜索 `createStore`、`zustand`、`pinia`、`redux` | 六、状态管理模式 |
| 编码规范 | 从代码中提取命名约定、文件组织 | 七、编码规范 |
| 开发流程 | 总结新增模块需要的步骤 | 八、新增模块Checklist |

### 后端项目

| 扫描项 | 查找方式 | 写入模板章节 |
|--------|----------|-------------|
| 技术栈 | 读取 `pom.xml` 或 `package.json` dependencies | 一、技术栈 |
| 目录结构 | 遍历 `src/` 目录树 | 二、目录结构 |
| 分层架构 | 分析 Controller/Service/Mapper 调用链 | 三、分层架构 |
| Entity 写法 | 搜索 `model/entity/` 或 `models/` | 四、Entity模板 |
| DTO/VO 写法 | 搜索 `dto/`、`vo/`、`request/` | 五、DTO/VO模板 |
| Mapper 写法 | 搜索 `mapper/` 或 `repository/` | 六、Mapper模板 |
| Service 写法 | 搜索 `service/impl/` | 七、Service模板 |
| Controller 写法 | 搜索 `controller/` 或 `routes/` | 八、Controller模板 |
| 统一响应与异常 | 搜索 `BaseResponse`、`ErrorCode`、`ExceptionHandler` | 九、统一响应与异常 |
| 数据库规范 | 读取 `sql/`、`application.yml` | 十、数据库规范 |
| 编码规范 | 从代码中提取命名约定、分层规则 | 十一、编码规范 |
| 开发流程 | 总结新增模块需要的步骤 | 十二、新增模块Checklist |

---

## 扫描步骤

### Step 1：判断项目类型

读取 `package.json` 或项目根目录，判断项目类型：
- 前端：有 `react` / `vue` / `angular` / `vite` / `webpack`
- 后端：有 `spring-boot` / `express` / `nestjs` / `fastapi` / `gin`
- 全栈：同时包含前后端目录

### Step 2：遍历关键目录

按项目类型扫描关键目录：

```
前端项目重点扫描：
  package.json      → 技术栈
  src/              → 目录结构
  src/routes/       → 路由模式
  src/features/     → 模块结构
  src/stores/       → 状态管理
  src/main.tsx      → API调用配置

后端项目重点扫描：
  pom.xml           → 技术栈
  src/              → 目录结构
  src/controller/   → Controller模板
  src/service/      → Service模板
  src/mapper/       → Mapper模板
  src/model/        → Entity/DTO/VO模板
  src/common/       → 统一响应与异常
  sql/              → 数据库规范
```

### Step 3：提取模式

对每个扫描项：
1. 找 2-3 个典型文件作为样本
2. 提取**核心结构**（去掉业务逻辑，保留骨架）
3. 标注关键调用链和依赖关系
4. 将可替换部分用 `[Module]`、`[module]`、`[table_name]` 等占位符标注

### Step 4：写入模板文档

前端/后端各写一个完整 Markdown 文件，按章节组织。每个章节包含：
- 说明文字（这个模式是什么、为什么这样做）
- 代码骨架（从现有代码提取，占位符标注可替换部分）
- 约定表格（命名规范、字段约定等）

---

## 输出位置

所有模板写入 `docs/03-模板中心/`：

```
docs/03-模板中心/
├── README.md           # 模板索引
├── 前端开发模板.md      # 前端完整模板
└── 后端开发模板.md      # 后端完整模板
```

---

## 使用方式（后续开发时）

开发新模块时：
1. 先看 `03-模板中心/README.md` 了解模板概况
2. 打开对应的前端/后端开发模板
3. 参照代码骨架和规范编写
4. 按照 Checklist 逐项完成
5. 如果发现模板与实际不符，更新模板（模板服务于项目）
