# React + TypeScript + Vite 前端模板

> 适用于全新 React 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | React | 18.x | 前端 UI 框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 5.x | 开发服务器 + 构建 |
| 路由 | React Router | 6.x | 客户端路由 |
| 数据请求 | TanStack Query | 5.x | 异步状态管理、缓存 |
| 状态管理 | Zustand | 4.x | 轻量全局状态 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| UI 组件 | shadcn/ui | latest | 基于 Radix UI 的组件库 |
| 表单 | React Hook Form | 7.x | 表单处理 |
| 校验 | Zod | 3.x | Schema 校验 |
| HTTP | Axios | 1.x | HTTP 客户端 |

## 二、目录结构

```
src/
├── components/           # 通用组件
│   ├── ui/              # shadcn/ui 组件
│   └── common/          # 业务通用组件
├── features/            # 功能模块（按业务域划分）
│   └── [module]/
│       ├── components/  # 模块私有组件
│       ├── hooks/       # 模块私有 Hooks
│       ├── api.ts       # 模块 API 调用
│       ├── types.ts     # 模块类型定义
│       └── index.tsx    # 模块入口
├── hooks/               # 全局 Hooks
├── lib/                 # 工具函数
│   ├── axios.ts         # Axios 实例配置
│   └── utils.ts         # 通用工具
├── routes/              # 路由配置
│   ├── index.tsx        # 路由定义
│   └── guards.tsx       # 路由守卫
├── stores/              # 全局状态
│   └── [module].ts      # Zustand Store
├── types/               # 全局类型定义
│   └── api.ts           # API 响应类型
├── App.tsx              # 根组件
├── main.tsx             # 入口文件
└── vite-env.d.ts        # Vite 类型声明
```

## 三、路由模式

```tsx
// src/routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: () => import('@/features/dashboard'),
      },
      {
        path: 'users',
        lazy: () => import('@/features/users'),
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('@/features/auth/LoginPage'),
  },
]);
```

```tsx
// src/main.tsx
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
```

## 四、Feature 模块结构

```tsx
// src/features/users/index.tsx
import { useQuery } from '@tanstack/react-query';
import { userApi } from './api';
import type { User } from './types';

export function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getList,
  });

  if (isLoading) return <div>Loading...</div>;
  return <UserList users={users} />;
}

export default UsersPage;
```

```ts
// src/features/users/api.ts
import { request } from '@/lib/axios';
import type { User, UserQuery } from './types';

export const userApi = {
  getList: (params?: UserQuery) => 
    request.get<{ list: User[]; total: number }>('/users', { params }),
  
  getById: (id: string) => 
    request.get<User>(`/users/${id}`),
  
  create: (data: Partial<User>) => 
    request.post<User>('/users', data),
  
  update: (id: string, data: Partial<User>) => 
    request.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => 
    request.delete(`/users/${id}`),
};
```

## 五、API 调用模式

```ts
// src/lib/axios.ts
import axios from 'axios';

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 六、状态管理模式

```ts
// src/stores/user.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'user-storage' }
  )
);
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserList.tsx` |
| Hooks | camelCase + use 前缀 | `useUsers.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 类型 | PascalCase | `User`, `UserQuery` |
| 文件 | kebab-case 或 PascalCase | `user-list.tsx` 或 `UserList.tsx` |

### 文件组织

- 每个文件只导出一个主要组件/函数
- 类型定义放在 `types.ts` 或内联
- 样式优先使用 Tailwind，复杂样式用 CSS Modules

### 组件结构

```tsx
// 1. 导入
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. 类型定义
interface Props {
  id: string;
}

// 3. 组件定义
export function Component({ id }: Props) {
  // 3.1 State
  const [isOpen, setIsOpen] = useState(false);
  
  // 3.2 Hooks
  const { data } = useQuery({ ... });
  
  // 3.3 Effects
  useEffect(() => { ... }, []);
  
  // 3.4 Handlers
  const handleClick = () => { ... };
  
  // 3.5 Render
  return <div>...</div>;
}
```

## 八、新增模块 Checklist

- [ ] 1. 创建模块目录 `src/features/[module]/`
- [ ] 2. 定义类型 `types.ts`
- [ ] 3. 创建 API 调用 `api.ts`
- [ ] 4. 创建页面组件 `index.tsx` 或 `[Module]Page.tsx`
- [ ] 5. 如需私有组件 → 创建 `components/`
- [ ] 6. 如需私有 Hooks → 创建 `hooks/`
- [ ] 7. 添加路由 → `src/routes/index.tsx`
- [ ] 8. 如需全局状态 → 创建 `src/stores/[module].ts`
- [ ] 9. 添加侧边栏导航（如有）
- [ ] 10. 添加国际化文本（如有）
