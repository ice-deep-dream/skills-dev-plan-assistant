# Express + TypeScript 后端模板

> 适用于全新 Express 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Express | 4.x | Node.js Web 框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| ORM | Prisma | 5.x | 现代化 ORM |
| 数据库 | PostgreSQL | 15.x | 关系型数据库 |
| 认证 | JWT | - | Token 认证 |
| 校验 | Zod | 3.x | Schema 校验 |
| 日志 | Pino | 8.x | 高性能日志 |

## 二、目录结构

```
src/
├── config/               # 配置文件
│   ├── index.ts         # 配置入口
│   └── database.ts      # 数据库配置
├── controllers/          # 控制器
│   └── [module].controller.ts
├── middlewares/          # 中间件
│   ├── auth.ts          # 认证中间件
│   ├── errorHandler.ts  # 错误处理
│   └── validate.ts      # 参数校验
├── routes/               # 路由
│   ├── index.ts         # 路由入口
│   └── [module].routes.ts
├── services/             # 业务逻辑
│   └── [module].service.ts
├── repositories/         # 数据访问
│   └── [module].repository.ts
├── types/                # 类型定义
│   └── index.ts
├── utils/                # 工具函数
│   └── response.ts       # 统一响应
├── app.ts                # Express 应用
└── index.ts              # 入口文件
```

## 三、应用初始化

```ts
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

export const createApp = () => {
  const app = express();
  
  // 中间件
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  
  // 路由
  app.use('/api', routes);
  
  // 错误处理
  app.use(errorHandler);
  
  return app;
};
```

```ts
// src/index.ts
import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

## 四、分层架构模板

```ts
// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../middlewares/asyncHandler';

export const userController = {
  getList: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize, keyword } = req.query;
    const result = await userService.getList({ page, pageSize, keyword });
    res.success(result);
  }),
  
  getById: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.getById(id);
    res.success(user);
  }),
  
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    res.success(user, 201);
  }),
  
  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await userService.update(id, req.body);
    res.success(user);
  }),
  
  delete: asyncHandler(async (req: Request, res: Response) => {
    await userService.delete(req.params.id);
    res.success(null);
  }),
};
```

```ts
// src/services/user.service.ts
import { userRepository } from '../repositories/user.repository';
import { hashPassword } from '../utils/password';

export const userService = {
  getList: async (params: QueryParams) => {
    const { page = 1, pageSize = 10, keyword } = params;
    const where = keyword 
      ? { OR: [{ username: { contains: keyword } }, { email: { contains: keyword } }] }
      : {};
    
    const [list, total] = await Promise.all([
      userRepository.findMany({ where, skip: (page - 1) * pageSize, take: pageSize }),
      userRepository.count({ where }),
    ]);
    
    return { list, total, page, pageSize };
  },
  
  getById: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('用户不存在');
    return user;
  },
  
  create: async (data: CreateUserInput) => {
    const hashedPassword = await hashPassword(data.password);
    return userRepository.create({ ...data, password: hashedPassword });
  },
  
  update: async (id: string, data: UpdateUserInput) => {
    await userService.getById(id);
    return userRepository.update(id, data);
  },
  
  delete: async (id: string) => {
    await userService.getById(id);
    await userRepository.delete(id);
  },
};
```

```ts
// src/repositories/user.repository.ts
import { prisma } from '../config/database';
import type { User, Prisma } from '@prisma/client';

export const userRepository = {
  findMany: async (params: Prisma.UserFindManyArgs) => 
    prisma.user.findMany(params),
  
  findById: async (id: string) => 
    prisma.user.findUnique({ where: { id } }),
  
  create: async (data: Prisma.UserCreateInput) => 
    prisma.user.create({ data }),
  
  update: async (id: string, data: Prisma.UserUpdateInput) => 
    prisma.user.update({ where: { id }, data }),
  
  delete: async (id: string) => 
    prisma.user.delete({ where: { id } }),
  
  count: async (params: Prisma.UserCountArgs) => 
    prisma.user.count(params),
};
```

## 五、路由模式

```ts
// src/routes/user.routes.ts
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateUserSchema } from '../validators/user';

const router = Router();

router.use(auth); // 认证中间件

router.get('/', userController.getList);
router.get('/:id', userController.getById);
router.post('/', validate(createUserSchema), userController.create);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.delete);

export default router;
```

## 六、统一响应与异常

```ts
// src/utils/response.ts
import { Response } from 'express';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

declare global {
  interface Response {
    success: <T>(data: T, code?: number) => void;
    fail: (code: number, message: string) => void;
  }
}

export const extendResponse = (req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data: T, code = 200) => {
    res.json({ code, message: 'success', data });
  };
  res.fail = (code: number, message: string) => {
    res.json({ code, message, data: null });
  };
  next();
};
```

```ts
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      data: null,
    });
  }
  
  res.status(500).json({
    code: 500,
    message: 'Internal Server Error',
    data: null,
  });
};
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件 | kebab-case | `user.controller.ts` |
| 类 | PascalCase | `UserService` |
| 函数 | camelCase | `getUserById` |
| 常量 | UPPER_SNAKE | `JWT_SECRET` |
| 接口 | PascalCase | `CreateUserInput` |

### 分层职责

| 层 | 职责 |
|------|------|
| Controller | 参数校验、调用 Service、响应 |
| Service | 业务逻辑、事务管理 |
| Repository | 数据访问、SQL 查询 |

## 八、新增模块 Checklist

- [ ] 1. 定义类型 `src/types/[module].ts`
- [ ] 2. 创建 Repository `src/repositories/[module].repository.ts`
- [ ] 3. 创建 Service `src/services/[module].service.ts`
- [ ] 4. 创建 Controller `src/controllers/[module].controller.ts`
- [ ] 5. 创建路由 `src/routes/[module].routes.ts`
- [ ] 6. 注册路由 `src/routes/index.ts`
- [ ] 7. 添加校验 Schema（如有）
- [ ] 8. 添加 API 文档注释
