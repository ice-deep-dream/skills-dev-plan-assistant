# 默认模板库

> 适用于全新项目，在扫描项目模板前作为参考。

## 使用方式

1. 新项目启动时，AI 展示本索引供用户选择技术栈
2. 用户选择后，复制对应模板到 `docs/03-模板中心/`
3. 后续模块开发按模板进行，保持风格一致

## 前端模板

| 模板 | 技术栈 | 适用场景 |
|------|--------|----------|
| [React + TypeScript](frontend/react-typescript.md) | React 18 + TS + Vite + TanStack Query + Zustand + Tailwind | 中大型 SPA、需要类型安全 |
| [Vue 3 + Vite](frontend/vue3-vite.md) | Vue 3 + Vite + Pinia + Vue Router + Tailwind | 渐进式开发、快速原型 |
| [Next.js App Router](frontend/nextjs-app.md) | Next.js 14 + App Router + Server Components | SEO 优先、全栈应用 |
| [Vanilla JS/TS](frontend/vanilla.md) | TypeScript + Vite + 原生 DOM | 小型工具、嵌入脚本 |

## 后端模板

| 模板 | 技术栈 | 适用场景 |
|------|--------|----------|
| [Express + TypeScript](backend/express-typescript.md) | Express + TS + Prisma + PostgreSQL | 快速 API、中小型项目 |
| [NestJS](backend/nestjs.md) | NestJS + TypeORM/Prisma + PostgreSQL | 企业级应用、模块化架构 |
| [Spring Boot](backend/springboot.md) | Spring Boot 3 + MyBatis-Plus + MySQL | 企业 Java 生态、大型项目 |
| [FastAPI](backend/fastapi.md) | FastAPI + SQLAlchemy + PostgreSQL | Python 生态、AI/ML 应用 |

## 模板内容结构

每个模板包含以下章节：

| 章节 | 说明 |
|------|------|
| 技术栈 | 核心技术及版本说明 |
| 目录结构 | 标准项目结构 |
| 核心模式 | 路由/API/状态管理等核心代码模式 |
| 编码规范 | 命名约定、文件组织等 |
| 新增模块 Checklist | 开发新模块的步骤清单 |

## 模板 vs 项目模板

| 场景 | 使用内容 |
|------|----------|
| 全新项目 | 使用本默认模板库 |
| 已有项目 | 扫描 `src/` 提取实际模式，覆盖默认模板 |
| 混合场景 | 默认模板作为参考，项目实际模式优先 |
