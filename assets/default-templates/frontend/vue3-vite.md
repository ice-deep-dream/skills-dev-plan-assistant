# Vue 3 + Vite + Pinia 前端模板

> 适用于全新 Vue 3 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Vue | 3.x | 渐进式前端框架 |
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 5.x | 开发服务器 + 构建 |
| 路由 | Vue Router | 4.x | 官方路由 |
| 状态管理 | Pinia | 2.x | Vue 3 官方推荐 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| UI 组件 | Element Plus / Naive UI | latest | 企业级组件库 |
| HTTP | Axios | 1.x | HTTP 客户端 |

## 二、目录结构

```
src/
├── components/           # 通用组件
│   └── common/          # 业务通用组件
├── views/                # 页面组件
│   └── [module]/
│       ├── index.vue    # 页面入口
│       ├── components/  # 页面私有组件
│       └── composables/ # 页面私有组合式函数
├── composables/          # 全局组合式函数
├── api/                  # API 调用
│   ├── index.ts         # Axios 实例配置
│   └── [module].ts      # 模块 API
├── stores/               # 状态管理
│   ├── index.ts         # Store 入口
│   └── [module].ts      # 模块 Store
├── router/               # 路由配置
│   ├── index.ts         # 路由实例
│   └── guards.ts        # 路由守卫
├── types/                # 类型定义
│   └── api.ts           # API 类型
├── utils/                # 工具函数
├── App.vue               # 根组件
└── main.ts               # 入口文件
```

## 三、路由模式

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理', icon: 'user' },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

```ts
// src/router/guards.ts
import { useUserStore } from '@/stores/user';

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  
  if (to.meta.requiresAuth !== false && !userStore.token) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});
```

## 四、页面组件结构

```vue
<!-- src/views/users/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserApi } from '@/api/user';
import type { User } from '@/types/api';

// 1. Props/Emits
const props = defineProps<{ id?: string }>();
const emit = defineEmits<{ select: [user: User] }>();

// 2. Composables
const userApi = useUserApi();
const userStore = useUserStore();

// 3. Reactive State
const loading = ref(false);
const users = ref<User[]>([]);

// 4. Computed
const filteredUsers = computed(() => 
  users.value.filter(u => u.status === 'active')
);

// 5. Methods
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await userApi.getList();
    users.value = res.data;
  } finally {
    loading.value = false;
  }
};

// 6. Lifecycle
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold">用户列表</h1>
    <UserList :users="filteredUsers" :loading="loading" @select="emit('select', $event)" />
  </div>
</template>
```

## 五、API 调用模式

```ts
// src/api/index.ts
import axios from 'axios';

export const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

```ts
// src/api/user.ts
import { request } from './index';
import type { User, UserQuery, PageResult } from '@/types/api';

export const useUserApi = () => ({
  getList: (params?: UserQuery) => 
    request.get<PageResult<User>>('/users', { params }),
  
  getById: (id: string) => 
    request.get<User>(`/users/${id}`),
  
  create: (data: Partial<User>) => 
    request.post<User>('/users', data),
  
  update: (id: string, data: Partial<User>) => 
    request.put<User>(`/users/${id}`, data),
  
  delete: (id: string) => 
    request.delete(`/users/${id}`),
});
```

## 六、状态管理模式

```ts
// src/stores/user.ts
import { defineStore } from 'pinia';
import type { User } from '@/types/api';

interface UserState {
  user: User | null;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token'),
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.user?.username ?? '',
  },
  
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    },
  },
});
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserList.vue` |
| 组合式函数 | camelCase + use 前缀 | `useUsers.ts` |
| 工具函数 | camelCase | `formatDate.ts` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 类型 | PascalCase | `User`, `UserQuery` |

### Vue 组件结构顺序

```vue
<script setup lang="ts">
// 1. 导入
// 2. Props/Emits 定义
// 3. Composables
// 4. Reactive State
// 5. Computed
// 6. Methods
// 7. Lifecycle Hooks
</script>

<template>
<!-- 模板内容 -->
</template>

<style scoped>
/* 样式（如需要）*/
</style>
```

## 八、新增模块 Checklist

- [ ] 1. 创建页面目录 `src/views/[module]/`
- [ ] 2. 创建页面入口 `index.vue`
- [ ] 3. 定义类型 `src/types/[module].ts`
- [ ] 4. 创建 API 调用 `src/api/[module].ts`
- [ ] 5. 如需私有组件 → 创建 `components/`
- [ ] 6. 如需组合式函数 → 创建 `composables/`
- [ ] 7. 添加路由 → `src/router/index.ts`
- [ ] 8. 如需全局状态 → 创建 `src/stores/[module].ts`
- [ ] 9. 添加侧边栏导航
- [ ] 10. 添加国际化文本（如有）
