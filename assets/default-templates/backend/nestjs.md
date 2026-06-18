# NestJS 后端模板

> 适用于全新 NestJS 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | NestJS | 10.x | 企业级 Node.js 框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| ORM | Prisma / TypeORM | 5.x / 0.3.x | 现代化 ORM |
| 数据库 | PostgreSQL | 15.x | 关系型数据库 |
| 认证 | Passport + JWT | - | 认证中间件 |
| 校验 | class-validator | 0.14.x | DTO 校验 |
| 文档 | Swagger | 7.x | API 文档 |

## 二、目录结构

```
src/
├── modules/              # 功能模块
│   └── [module]/
│       ├── dto/        # 数据传输对象
│       │   ├── create-[module].dto.ts
│       │   ├── update-[module].dto.ts
│       │   └── query-[module].dto.ts
│       ├── entities/   # 实体定义
│       ├── [module].controller.ts
│       ├── [module].service.ts
│       └── [module].module.ts
├── common/              # 公共模块
│   ├── decorators/     # 自定义装饰器
│   ├── filters/        # 异常过滤器
│   ├── guards/          # 守卫
│   ├── interceptors/    # 拦截器
│   ├── pipes/           # 管道
│   └── interfaces/      # 公共接口
├── config/              # 配置
│   ├── database.config.ts
│   └── app.config.ts
├── app.module.ts        # 根模块
└── main.ts              # 入口文件
```

## 三、模块结构

```ts
// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

```ts
// src/modules/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Query() query: QueryUserDto) {
    return this.usersService.findAll(query);
  }
  
  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @Put(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
```

```ts
// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async findAll(query: QueryUserDto) {
    const { page = 1, pageSize = 10, keyword } = query;
    const where = keyword 
      ? { OR: [{ username: { contains: keyword } }, { email: { contains: keyword } }] }
      : {};
    
    const [list, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);
    
    return { list, total, page, pageSize };
  }
  
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('用户不存在');
    return user;
  }
  
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }
  
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }
  
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
```

## 四、DTO 模板

```ts
// src/modules/users/dto/create-user.dto.ts
import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  username: string;
  
  @ApiProperty({ description: '邮箱', example: 'admin@example.com' })
  @IsEmail()
  email: string;
  
  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}
```

```ts
// src/modules/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

```ts
// src/modules/users/dto/query-user.dto.ts
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUserDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
  
  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;
  
  @ApiPropertyOptional({ description: '搜索关键词' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
```

## 五、统一响应拦截器

```ts
// src/common/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        code: 200,
        message: 'success',
        data,
      })),
    );
  }
}
```

## 六、全局异常过滤器

```ts
// src/common/filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const message = exception instanceof HttpException
      ? exception.message
      : 'Internal Server Error';
    
    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 模块 | xxx.module.ts | `users.module.ts` |
| 控制器 | xxx.controller.ts | `users.controller.ts` |
| 服务 | xxx.service.ts | `users.service.ts` |
| DTO | xxx.dto.ts | `create-user.dto.ts` |
| 实体 | xxx.entity.ts | `user.entity.ts` |

### 装饰器顺序

```ts
@Controller('users')
@ApiTags('用户管理')
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get()
  @ApiOperation({ summary: '获取列表' })
  @ApiResponse({ status: 200, description: '成功' })
  findAll() {}
}
```

## 八、新增模块 Checklist

- [ ] 1. 创建模块目录 `src/modules/[module]/`
- [ ] 2. 定义 DTO `dto/create-[module].dto.ts` / `update-[module].dto.ts` / `query-[module].dto.ts`
- [ ] 3. 定义实体 `entities/[module].entity.ts`
- [ ] 4. 创建 Service `[module].service.ts`
- [ ] 5. 创建 Controller `[module].controller.ts`
- [ ] 6. 创建 Module `[module].module.ts`
- [ ] 7. 在 AppModule 中导入模块
- [ ] 8. 添加 Swagger API 文档装饰器
