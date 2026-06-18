# Vanilla JS/TS 前端模板

> 适用于小型工具、嵌入脚本，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 语言 | TypeScript | 5.x | 类型安全 |
| 构建 | Vite | 5.x | 快速构建 |
| 样式 | Tailwind CSS | 3.x | 原子化 CSS |
| HTTP | Fetch API | - | 原生 API |

## 二、目录结构

```
src/
├── main.ts              # 入口文件
├── app.ts               # 应用逻辑
├── components/          # UI 组件
│   └── [Component].ts
├── services/            # API 调用
│   └── api.ts
├── utils/               # 工具函数
│   └── helpers.ts
├── types/               # 类型定义
│   └── index.ts
└── styles/              # 样式文件
    └── main.css
```

## 三、应用初始化模式

```ts
// src/main.ts
import { App } from './app';
import './styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
```

```ts
// src/app.ts
export class App {
  private container: HTMLElement;
  
  constructor() {
    this.container = document.getElementById('app')!;
  }
  
  async init() {
    await this.render();
    this.bindEvents();
  }
  
  private async render() {
    this.container.innerHTML = this.template();
  }
  
  private template(): string {
    return `
      <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold">App</h1>
        <div id="content"></div>
      </div>
    `;
  }
  
  private bindEvents() {
    // 事件绑定
  }
}
```

## 四、组件模式

```ts
// src/components/TodoList.ts
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export class TodoList {
  private element: HTMLElement;
  private todos: Todo[] = [];
  
  constructor(container: HTMLElement) {
    this.element = container;
  }
  
  render() {
    this.element.innerHTML = `
      <ul class="space-y-2">
        ${this.todos.map(todo => `
          <li class="flex items-center gap-2 p-2 bg-gray-100 rounded">
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   data-id="${todo.id}" class="toggle">
            <span class="${todo.completed ? 'line-through' : ''}">${todo.title}</span>
            <button data-id="${todo.id}" class="delete ml-auto text-red-500">删除</button>
          </li>
        `).join('')}
      </ul>
    `;
    this.bindEvents();
  }
  
  setTodos(todos: Todo[]) {
    this.todos = todos;
    this.render();
  }
  
  private bindEvents() {
    this.element.querySelectorAll('.toggle').forEach(el => {
      el.addEventListener('change', (e) => {
        const id = (e.target as HTMLInputElement).dataset.id;
        this.onToggle?.(id!);
      });
    });
    
    this.element.querySelectorAll('.delete').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id;
        this.onDelete?.(id!);
      });
    });
  }
  
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

## 五、API 调用模式

```ts
// src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_URL;

async function request<T>(
  path: string, 
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  
  return res.json();
}

export const api = {
  get: <T>(path: string) => 
    request<T>(path),
  
  post: <T>(path: string, body: unknown) => 
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  put: <T>(path: string, body: unknown) => 
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  delete: (path: string) => 
    request<void>(path, { method: 'DELETE' }),
};
```

## 六、状态管理模式（轻量）

```ts
// src/store.ts
type Listener<T> = (state: T) => void;

export class Store<T> {
  private state: T;
  private listeners: Listener<T>[] = [];
  
  constructor(initialState: T) {
    this.state = initialState;
  }
  
  getState(): T {
    return this.state;
  }
  
  setState(newState: Partial<T>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(l => l(this.state));
  }
  
  subscribe(listener: Listener<T>) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

// 使用示例
interface AppState {
  user: User | null;
  todos: Todo[];
}

export const store = new Store<AppState>({
  user: null,
  todos: [],
});
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 类 | PascalCase | `TodoList` |
| 函数 | camelCase | `fetchTodos` |
| 常量 | UPPER_SNAKE | `API_BASE_URL` |
| 私有属性 | 下划线前缀 | `_state` |
| DOM 元素 | 后缀 Element | `containerElement` |

### 文件组织

- 一个文件一个类/模块
- 使用 ES Modules（import/export）
- 类型定义放在 `types/` 或内联

## 八、新增模块 Checklist

- [ ] 1. 创建组件类 `src/components/[Component].ts`
- [ ] 2. 定义类型 `src/types/[module].ts`
- [ ] 3. 创建 API 调用（如需） `src/services/[module].ts`
- [ ] 4. 在 App 中引入并初始化
- [ ] 5. 添加样式（如需）
- [ ] 6. 添加事件绑定
