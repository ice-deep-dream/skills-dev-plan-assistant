# FastAPI 后端模板

> 适用于全新 FastAPI 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | FastAPI | 0.110.x | 高性能 Python Web 框架 |
| ORM | SQLAlchemy | 2.x | Python ORM |
| 数据库 | PostgreSQL | 15.x | 关系型数据库 |
| 认证 | PyJWT | 2.x | JWT 认证 |
| 校验 | Pydantic | 2.x | 数据校验 |
| 迁移 | Alembic | 1.x | 数据库迁移 |

## 二、目录结构

```
app/
├── api/                  # API 路由
│   ├── v1/              # 版本化路由
│   │   └── [module].py
│   └── deps.py          # 依赖注入
├── models/              # 数据库模型
│   └── [module].py
├── schemas/             # Pydantic 模型
│   ├── [module].py
│   └── common.py
├── services/            # 业务逻辑
│   └── [module].py
├── repositories/        # 数据访问
│   └── [module].py
├── core/                # 核心配置
│   ├── config.py
│   ├── security.py
│   └── database.py
├── utils/                # 工具函数
│   └── response.py
└── main.py               # 应用入口
```

## 三、应用初始化

```python
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
```

```python
# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FastAPI Project"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str = "postgresql://user:pass@localhost/db"
    
    SECRET_KEY: str = "your-secret-key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
```

## 四、分层架构模板

### Router 层

```python
# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserCreate, UserUpdate, UserOut, UserQuery
from app.services.user import UserService
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=list[UserOut])
async def list_users(
    query: UserQuery = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """获取用户列表"""
    return await UserService(db).get_list(query)


@router.get("/{user_id}", response_model=UserOut)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """获取用户详情"""
    user = await UserService(db).get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """创建用户"""
    return await UserService(db).create(user_in)


@router.put("/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新用户"""
    user = await UserService(db).update(user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    """删除用户"""
    success = await UserService(db).delete(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="用户不存在")
    return {"message": "删除成功"}
```

### Service 层

```python
# app/services/user.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserQuery
from app.repositories.user import UserRepository
from app.core.security import get_password_hash


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)
    
    async def get_list(self, query: UserQuery) -> list[User]:
        return await self.repo.find_all(query)
    
    async def get_by_id(self, user_id: int) -> User | None:
        return await self.repo.find_by_id(user_id)
    
    async def create(self, user_in: UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        user = User(
            username=user_in.username,
            email=user_in.email,
            hashed_password=hashed_password,
        )
        return await self.repo.save(user)
    
    async def update(self, user_id: int, user_in: UserUpdate) -> User | None:
        user = await self.repo.find_by_id(user_id)
        if not user:
            return None
        update_data = user_in.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
        for field, value in update_data.items():
            setattr(user, field, value)
        return await self.repo.save(user)
    
    async def delete(self, user_id: int) -> bool:
        return await self.repo.delete(user_id)
```

### Repository 层

```python
# app/repositories/user.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserQuery


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def find_all(self, query: UserQuery) -> list[User]:
        stmt = select(User)
        if query.keyword:
            stmt = stmt.where(
                User.username.ilike(f"%{query.keyword}%") |
                User.email.ilike(f"%{query.keyword}%")
            )
        stmt = stmt.offset((query.page - 1) * query.page_size).limit(query.page_size)
        result = await self.db.execute(stmt)
        return result.scalars().all()
    
    async def find_by_id(self, user_id: int) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    
    async def save(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
    
    async def delete(self, user_id: int) -> bool:
        user = await self.find_by_id(user_id)
        if not user:
            return False
        await self.db.delete(user)
        await self.db.commit()
        return True
```

## 五、Model 模板

```python
# app/models/user.py
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)
```

## 六、Schema 模板

```python
# app/schemas/user.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    username: str | None = Field(None, min_length=2, max_length=50)
    email: EmailStr | None = None
    password: str | None = Field(None, min_length=6)


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool
    created_at: datetime


class UserQuery(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)
    keyword: str | None = None
```

## 七、依赖注入

```python
# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session
from app.core.security import decode_token
from app.models.user import User
from app.repositories.user import UserRepository

security = HTTPBearer()


async def get_db():
    async with async_session() as session:
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭据",
        )
    user = await UserRepository(db).find_by_id(payload.get("sub"))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在",
        )
    return user
```

## 八、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 文件 | snake_case | `user_service.py` |
| 类 | PascalCase | `UserService` |
| 函数 | snake_case | `get_user_by_id` |
| 常量 | UPPER_SNAKE | `MAX_PAGE_SIZE` |
| 变量 | snake_case | `user_list` |

### 分层职责

| 层 | 职责 |
|------|------|
| Router | 参数校验、依赖注入、响应 |
| Service | 业务逻辑、事务管理 |
| Repository | 数据访问、SQL 操作 |

## 九、新增模块 Checklist

- [ ] 1. 定义 Model `app/models/[module].py`
- [ ] 2. 定义 Schema `app/schemas/[module].py`
- [ ] 3. 创建 Repository `app/repositories/[module].py`
- [ ] 4. 创建 Service `app/services/[module].py`
- [ ] 5. 创建 Router `app/api/v1/[module].py`
- [ ] 6. 注册路由 `app/api/v1/__init__.py`
- [ ] 7. 编写数据库迁移（Alembic）
- [ ] 8. 添加 API 文档注释
