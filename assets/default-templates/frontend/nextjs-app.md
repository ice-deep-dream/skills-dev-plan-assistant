# Next.js App Router 前端模板

> 适用于全新 Next.js 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Next.js | 14.x | React 全栈框架 |
| 模式 | App Router | - | 服务端组件优先 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| UI 组件 | shadcn/ui | latest | 基于 Radix UI |
| 表单 | React Hook Form | 7.x | 表单处理 |
| 校验 | Zod | 3.x | Schema 校验 |
| 数据请求 | Server Actions | - | 服务端数据交互 |

## 二、目录结构

```
src/
├── app/                   # App Router 目录
│   ├── (auth)/           # 路由组（无 layout）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/      # 路由组（共享 layout）
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── users/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── api/              # API Routes
│   │   └── users/
│   │       └── route.ts
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # 通用组件
│   ├── ui/              # shadcn/ui 组件
│   └── common/          # 业务通用组件
├── features/             # 功能模块
│   └── [module]/
│       ├── components/
│       ├── actions.ts   # Server Actions
│       └── queries.ts   # 数据查询
├── lib/                  # 工具函数
│   ├── axios.ts         # Axios 配置
│   └── utils.ts         # 工具函数
├── types/                # 类型定义
└── middleware.ts         # 中间件（认证等）
```

## 三、路由模式

```tsx
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

```tsx
// app/(dashboard)/users/page.tsx
import { UsersTable } from './_components/UsersTable';
import { getUsers } from './actions';

export default async function UsersPage() {
  const users = await getUsers(); // 服务端直接获取数据
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">用户管理</h1>
      <UsersTable users={users} />
    </div>
  );
}
```

## 四、Server Actions 模式

```ts
// app/(dashboard)/users/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const UserSchema = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
});

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  
  const data = UserSchema.parse({
    username: formData.get('username'),
    email: formData.get('email'),
  });
  
  const user = await db.user.create({ data });
  
  revalidatePath('/users');
  return { success: true, data: user };
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  revalidatePath('/users');
  return { success: true };
}
```

```tsx
// 在客户端调用 Server Action
'use client';

import { createUser } from './actions';

export function CreateUserForm() {
  return (
    <form action={createUser}>
      <input name="username" />
      <input name="email" type="email" />
      <button type="submit">创建用户</button>
    </form>
  );
}
```

## 五、数据获取模式

```tsx
// 服务端组件直接查询数据库
// app/(dashboard)/users/page.tsx
import { db } from '@/lib/db';

export default async function UsersPage() {
  const users = await db.user.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
  });
  
  return <UserList users={users} />;
}
```

```tsx
// 客户端组件通过 React Query 获取数据
'use client';

import { useQuery } from '@tanstack/react-query';

export function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  });
  
  if (isLoading) return <div>Loading...</div>;
  return <ul>{users?.map(u => <li key={u.id}>{u.username}</li>)}</ul>;
}
```

## 六、中间件模式

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  
  // 公开路由
  const publicPaths = ['/login', '/register'];
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  
  // 需要认证的路由
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    const user = await verifyToken(token);
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    return response;
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## 七、编码规范

### 服务端 vs 客户端组件

| 场景 | 使用 |
|------|------|
| 数据获取 | Server Component |
| 访问数据库 | Server Component |
| SEO 优先 | Server Component |
| 交互事件 | Client Component（'use client'） |
| useState/useEffect | Client Component |
| 浏览器 API | Client Component |

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 页面 | page.tsx | `app/users/page.tsx` |
| 布局 | layout.tsx | `app/(dashboard)/layout.tsx` |
| 加载状态 | loading.tsx | `app/users/loading.tsx` |
| 错误处理 | error.tsx | `app/users/error.tsx` |
| 私有组件 | _components/ | `app/users/_components/Table.tsx` |
| Server Actions | actions.ts | `app/users/actions.ts` |

## 八、新增模块 Checklist

- [ ] 1. 创建路由目录 `app/(dashboard)/[module]/`
- [ ] 2. 创建页面 `page.tsx`
- [ ] 3. 创建 Server Actions `actions.ts`
- [ ] 4. 定义类型 `types.ts`
- [ ] 5. 如需私有组件 → 创建 `_components/`
- [ ] 6. 如需加载状态 → 创建 `loading.tsx`
- [ ] 7. 如需错误处理 → 创建 `error.tsx`
- [ ] 8. 添加侧边栏导航
- [ ] 9. 更新中间件（如有新路由组）
- [ ] 10. 添加国际化（如有）
