# Spring Boot 后端模板

> 适用于全新 Spring Boot 项目，在扫描项目模板前作为参考。

## 一、技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 框架 | Spring Boot | 3.x | Java 企业级框架 |
| ORM | MyBatis-Plus | 3.5.x | 增强版 MyBatis |
| 数据库 | MySQL | 8.x | 关系型数据库 |
| 认证 | Spring Security + JWT | - | 认证授权 |
| 文档 | Knife4j | 4.x | Swagger 增强 |
| 构建 | Maven | 3.9.x | 依赖管理 |

## 二、目录结构

```
src/main/java/com/example/project/
├── controller/           # 控制器
│   └── [Module]Controller.java
├── service/             # 服务接口
│   └── [Module]Service.java
├── service/impl/        # 服务实现
│   └── [Module]ServiceImpl.java
├── mapper/              # 数据访问
│   └── [Module]Mapper.java
├── model/               # 数据模型
│   ├── entity/         # 实体类
│   │   └── [Module].java
│   ├── dto/            # 数据传输对象
│   │   ├── [Module]AddRequest.java
│   │   ├── [Module]UpdateRequest.java
│   │   └── [Module]QueryRequest.java
│   └── vo/             # 视图对象
│       └── [Module]VO.java
├── common/              # 公共模块
│   ├── BaseResponse.java
│   ├── ErrorCode.java
│   ├── ResultUtils.java
│   └── exception/
│       ├── BusinessException.java
│       └── GlobalExceptionHandler.java
├── config/              # 配置类
│   ├── MyBatisPlusConfig.java
│   └── WebMvcConfig.java
└── utils/               # 工具类
```

## 三、分层架构模板

### Controller 层

```java
// UserController.java
@RestController
@RequestMapping("/users")
@Tag(name = "用户管理")
public class UserController {
    
    @Resource
    private UserService userService;
    
    @GetMapping
    @Operation(summary = "获取用户列表")
    public BaseResponse<PageResult<UserVO>> list(UserQueryRequest queryRequest) {
        return ResultUtils.success(userService.list(queryRequest));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    public BaseResponse<UserVO> getById(@PathVariable Long id) {
        return ResultUtils.success(userService.getById(id));
    }
    
    @PostMapping
    @Operation(summary = "创建用户")
    public BaseResponse<Long> create(@RequestBody @Valid UserAddRequest addRequest) {
        return ResultUtils.success(userService.create(addRequest));
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "更新用户")
    public BaseResponse<Boolean> update(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateRequest updateRequest) {
        return ResultUtils.success(userService.update(id, updateRequest));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    public BaseResponse<Boolean> delete(@PathVariable Long id) {
        return ResultUtils.success(userService.delete(id));
    }
}
```

### Service 层

```java
// UserService.java
public interface UserService {
    PageResult<UserVO> list(UserQueryRequest queryRequest);
    UserVO getById(Long id);
    Long create(UserAddRequest addRequest);
    boolean update(Long id, UserUpdateRequest updateRequest);
    boolean delete(Long id);
}

// UserServiceImpl.java
@Service
public class UserServiceImpl implements UserService {
    
    @Resource
    private UserMapper userMapper;
    
    @Override
    public PageResult<UserVO> list(UserQueryRequest queryRequest) {
        Page<User> page = new Page<>(queryRequest.getPage(), queryRequest.getPageSize());
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.isNotBlank(queryRequest.getKeyword())) {
            wrapper.like(User::getUsername, queryRequest.getKeyword())
                   .or()
                   .like(User::getEmail, queryRequest.getKeyword());
        }
        Page<User> result = userMapper.selectPage(page, wrapper);
        return new PageResult<>(result.getTotal(), 
            result.getRecords().stream().map(this::toVO).toList());
    }
    
    @Override
    public UserVO getById(Long id) {
        User user = userMapper.selectById(id);
        ThrowUtils.throwIf(user == null, ErrorCode.NOT_FOUND, "用户不存在");
        return toVO(user);
    }
    
    @Override
    @Transactional
    public Long create(UserAddRequest addRequest) {
        User user = new User();
        BeanUtils.copyProperties(addRequest, user);
        user.setPassword(encryptPassword(addRequest.getPassword()));
        userMapper.insert(user);
        return user.getId();
    }
    
    @Override
    @Transactional
    public boolean update(Long id, UserUpdateRequest updateRequest) {
        getById(id); // 校验存在
        User user = new User();
        BeanUtils.copyProperties(updateRequest, user);
        user.setId(id);
        return userMapper.updateById(user) > 0;
    }
    
    @Override
    @Transactional
    public boolean delete(Long id) {
        getById(id); // 校验存在
        return userMapper.deleteById(id) > 0;
    }
    
    private UserVO toVO(User user) {
        UserVO vo = new UserVO();
        BeanUtils.copyProperties(user, vo);
        return vo;
    }
}
```

### Mapper 层

```java
// UserMapper.java
@Mapper
public interface UserMapper extends BaseMapper<User> {
    // 继承 MyBatis-Plus BaseMapper，自带 CRUD
    // 复杂查询可在此定义，配合 XML 文件
}
```

## 四、实体类模板

```java
// User.java
@Data
@TableName("user")
public class User implements Serializable {
    
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    
    private String username;
    
    private String email;
    
    private String password;
    
    private Integer status;
    
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
    
    @TableLogic
    private Integer isDeleted;
}
```

## 五、DTO/VO 模板

### DTO（请求）

```java
// UserAddRequest.java
@Data
public class UserAddRequest implements Serializable {
    
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度 2-20 位")
    private String username;
    
    @NotBlank(message = "邮箱不能为空")
    @Email(message = "邮箱格式不正确")
    private String email;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码至少 6 位")
    private String password;
}

// UserQueryRequest.java
@Data
public class UserQueryRequest extends PageRequest {
    
    private String keyword;
}

// PageRequest.java
@Data
public class PageRequest implements Serializable {
    
    @Min(value = 1, message = "页码最小为 1")
    private int page = 1;
    
    @Min(value = 1, message = "每页数量最小为 1")
    @Max(value = 100, message = "每页数量最大为 100")
    private int pageSize = 10;
}
```

### VO（响应）

```java
// UserVO.java
@Data
public class UserVO implements Serializable {
    
    private Long id;
    
    private String username;
    
    private String email;
    
    private Integer status;
    
    private Date createTime;
}
```

## 六、统一响应与异常

```java
// BaseResponse.java
@Data
public class BaseResponse<T> implements Serializable {
    
    private int code;
    private T data;
    private String message;
    
    public BaseResponse(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}

// ResultUtils.java
public class ResultUtils {
    
    public static <T> BaseResponse<T> success(T data) {
        return new BaseResponse<>(0, data, "ok");
    }
    
    public static BaseResponse<Boolean> error(ErrorCode errorCode) {
        return new BaseResponse<>(errorCode.getCode(), null, errorCode.getMessage());
    }
}

// ErrorCode.java
public enum ErrorCode {
    
    SUCCESS(0, "ok"),
    PARAMS_ERROR(40000, "请求参数错误"),
    NOT_FOUND_ERROR(40400, "数据不存在"),
    NO_AUTH_ERROR(40100, "无权限"),
    SYSTEM_ERROR(50000, "系统内部异常");
    
    private final int code;
    private final String message;
}
```

## 七、编码规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 类 | PascalCase | `UserController` |
| 方法 | camelCase | `getUserById` |
| 常量 | UPPER_SNAKE | `MAX_PAGE_SIZE` |
| 包 | 全小写 | `com.example.project` |

### 分层职责

| 层 | 职责 |
|------|------|
| Controller | 参数校验、调用 Service、响应封装 |
| Service | 业务逻辑、事务管理 |
| Mapper | 数据访问、SQL 执行 |

## 八、新增模块 Checklist

- [ ] 1. 编写建表 SQL
- [ ] 2. 创建 Entity `model/entity/[Module].java`
- [ ] 3. 创建 DTO `model/dto/[Module]AddRequest.java` / `[Module]UpdateRequest.java` / `[Module]QueryRequest.java`
- [ ] 4. 创建 VO `model/vo/[Module]VO.java`
- [ ] 5. 创建 Mapper `mapper/[Module]Mapper.java`
- [ ] 6. 创建 Service `service/[Module]Service.java` + `service/impl/[Module]ServiceImpl.java`
- [ ] 7. 创建 Controller `controller/[Module]Controller.java`
- [ ] 8. 添加 Knife4j API 文档注解
- [ ] 9. 如需复杂 SQL → 编写 Mapper XML
