# Personal Portfolio API 文档

| 项目 | 内容 |
| --- | --- |
| 文档版本 | v1.0 |
| 更新时间 | 2026-10-30 |
| API 风格 | REST / JSON |
| 默认 API 地址 | `http://localhost:3000/api` |
| 开发代理地址 | `http://localhost:5173/api` |
| 鉴权方式 | HttpOnly 会话 Cookie |
| OpenAPI | [openapi.yaml](openapi.yaml) |

## 1. 通用约定

### 1.1 请求头

提交 JSON 的请求需要：

```http
Content-Type: application/json
```

浏览器请求使用 `credentials: "include"` 携带管理会话 Cookie。

### 1.2 时间格式

`createdAt` 和 `updatedAt` 使用 ISO 8601 UTC 字符串，例如：

```text
2026-10-30T06:30:00.000Z
```

### 1.3 响应格式

列表返回：

```json
{
  "projects": []
}
```

错误返回：

```json
{
  "message": "错误说明"
}
```

### 1.4 请求体大小

JSON 请求体上限为 `100kb`。

### 1.5 鉴权

管理接口使用名为 `portfolio_session` 的 HttpOnly Cookie。

| 属性 | 值 |
| --- | --- |
| HttpOnly | 是 |
| SameSite | `Lax` |
| Secure | 生产环境为是 |
| Path | `/` |
| 有效期 | 8 小时 |

会话保存在 API 进程内存中，API 重启后所有管理员需要重新登录。

## 2. 接口总览

| 方法 | 路径 | 鉴权 | 成功状态 | 说明 |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | 否 | 200 | 健康检查 |
| GET | `/api/projects` | 否 | 200 | 获取已发布作品 |
| POST | `/api/auth/login` | 否 | 200 | 管理员登录 |
| POST | `/api/auth/logout` | 否 | 204 | 退出登录 |
| GET | `/api/auth/me` | 否 | 200 | 查询会话状态 |
| GET | `/api/admin/projects` | 是 | 200 | 获取全部作品 |
| POST | `/api/admin/projects` | 是 | 201 | 新增作品 |
| PUT | `/api/admin/projects/:id` | 是 | 200 | 编辑作品 |

没有提供 `DELETE /api/admin/projects/:id`。

## 3. 数据模型

### 3.1 Project

```json
{
  "id": "bdffd34e-39cf-42b1-911a-f79ebc96cb5a",
  "title": "Agent 工作流编排台",
  "description": "将检索、规划与人工确认串成可观测工作流。",
  "repoUrl": "https://github.com/example/agent-workflow",
  "liveUrl": "https://example.com/agent",
  "techStack": ["TypeScript", "Node.js", "SQLite"],
  "coverUrl": "https://example.com/cover.webp",
  "problem": "人工处理重复工单的上下文收集耗时。",
  "role": "核心开发",
  "outcome": "工单处理时间缩短 40%。",
  "tags": ["agent", "fullstack"],
  "featured": true,
  "published": true,
  "sortOrder": 100,
  "createdAt": "2026-10-30T06:30:00.000Z",
  "updatedAt": "2026-10-30T06:30:00.000Z"
}
```

| 字段 | 类型 | 可空 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 否 | 服务端生成的 UUID |
| `title` | string | 否 | 1–40 字 |
| `description` | string | 否 | 项目描述 |
| `repoUrl` | string | 是 | 源码地址，只允许 HTTP(S) |
| `liveUrl` | string | 是 | 线上地址，只允许 HTTP(S) |
| `techStack` | string[] | 否 | 至少 1 项、最多 12 项 |
| `coverUrl` | string | 是 | 封面图片地址，只允许 HTTP(S) |
| `problem` | string | 是 | 解决的问题 |
| `role` | string | 是 | 本人角色 |
| `outcome` | string | 是 | 结果或指标 |
| `tags` | ProjectTag[] | 否 | 分类数组，最多 12 项 |
| `featured` | boolean | 否 | 是否精选 |
| `published` | boolean | 否 | 是否公开 |
| `sortOrder` | integer | 否 | 越大越靠前 |
| `createdAt` | ISO string | 否 | 创建时间 |
| `updatedAt` | ISO string | 否 | 更新时间 |

### 3.2 ProjectTag

```text
agent | backend | frontend | fullstack
```

不支持的分类会导致 `400`。

### 3.3 ProjectInput

新增和编辑请求不包含 `id`、`createdAt`、`updatedAt`：

```json
{
  "title": "项目标题",
  "description": "项目描述",
  "repoUrl": null,
  "liveUrl": null,
  "techStack": ["Vue 3", "TypeScript"],
  "coverUrl": null,
  "problem": null,
  "role": null,
  "outcome": null,
  "tags": ["frontend"],
  "featured": false,
  "published": true,
  "sortOrder": 0
}
```

编辑接口使用完整对象替换，不做字段级 PATCH。

## 4. 校验规则

| 字段 | 规则 |
| --- | --- |
| `title` | 去除首尾空白后不能为空，最长 40 字 |
| `description` | 去除首尾空白后不能为空 |
| `techStack` | 必须是数组；去除空项和重复项；至少 1 项、最多 12 项 |
| `tags` | 必须是数组；只允许固定四个枚举值 |
| `repoUrl` | 空值或合法 HTTP(S) URL |
| `liveUrl` | 空值或合法 HTTP(S) URL |
| `coverUrl` | 空值或合法 HTTP(S) URL |
| `problem` | 空字符串会转换为 `null` |
| `role` | 空字符串会转换为 `null` |
| `outcome` | 空字符串会转换为 `null` |
| `featured` | 只有布尔 `true` 才会开启 |
| `published` | 不等于布尔 `false` 时默认为 `true` |
| `sortOrder` | 转为数字后截断为整数；非法值变为 `0` |

## 5. 接口详情

### 5.1 健康检查

#### `GET /api/health`

用于确认 API 是否运行。

响应 `200`：

```json
{
  "status": "ok"
}
```

### 5.2 获取公开作品

#### `GET /api/projects`

无需鉴权，只返回 `published=true` 的作品。

排序：

1. `featured` 为真的作品优先。
2. `sortOrder` 从大到小。
3. `createdAt` 从新到旧。

响应 `200`：

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "项目标题",
      "description": "项目描述",
      "repoUrl": null,
      "liveUrl": "https://example.com",
      "techStack": ["Vue 3"],
      "coverUrl": null,
      "problem": null,
      "role": null,
      "outcome": null,
      "tags": ["frontend"],
      "featured": true,
      "published": true,
      "sortOrder": 10,
      "createdAt": "2026-10-30T06:30:00.000Z",
      "updatedAt": "2026-10-30T06:30:00.000Z"
    }
  ]
}
```

### 5.3 管理员登录

#### `POST /api/auth/login`

请求：

```json
{
  "password": "your-admin-password"
}
```

成功响应 `200`：

```json
{
  "authenticated": true
}
```

响应同时设置 `portfolio_session` Cookie。

| 状态 | 场景 |
| --- | --- |
| 200 | 登录成功 |
| 401 | 口令错误 |
| 429 | 当前 IP 失败次数过多 |

限流规则：

- 统计窗口从第一次失败开始，持续 10 分钟。
- 提示口令错误的前 5 次返回 `401`。
- 达到上限后，后续请求返回 `429`。
- 登录成功后清除当前 IP 的失败记录。

### 5.4 查询会话

#### `GET /api/auth/me`

不需要会话即可调用。

已登录：

```json
{
  "authenticated": true
}
```

未登录或会话过期：

```json
{
  "authenticated": false
}
```

该接口始终返回 `200`，不会用 `401` 表示未登录。

### 5.5 退出登录

#### `POST /api/auth/logout`

清除当前会话和 Cookie。

成功响应：`204 No Content`。

即使请求未携带有效会话，也返回 `204`。

### 5.6 获取全部作品

#### `GET /api/admin/projects`

需要有效 `portfolio_session` Cookie。

返回已发布和草稿作品，排序规则与公开列表相同。

成功响应结构与 `GET /api/projects` 一致。

| 状态 | 场景 |
| --- | --- |
| 200 | 成功 |
| 401 | 未登录或会话过期 |

未授权响应：

```json
{
  "message": "未授权。"
}
```

### 5.7 新增作品

#### `POST /api/admin/projects`

需要鉴权。请求体为 `ProjectInput`。

成功响应 `201`：返回完整 `Project`。

| 状态 | 场景 |
| --- | --- |
| 201 | 创建成功 |
| 400 | 请求参数不符合规则 |
| 401 | 未登录或会话过期 |
| 500 | 数据库或其他服务端错误 |

参数错误示例：

```json
{
  "message": "标题不能超过 40 个字。"
}
```

### 5.8 编辑作品

#### `PUT /api/admin/projects/:id`

需要鉴权。请求体为完整 `ProjectInput`。

成功响应 `200`：返回更新后的完整 `Project`。

| 状态 | 场景 |
| --- | --- |
| 200 | 更新成功 |
| 400 | 参数错误或 ID 无效 |
| 401 | 未登录或会话过期 |
| 404 | 作品不存在 |
| 500 | 数据库或其他服务端错误 |

作品不存在：

```json
{
  "message": "作品不存在。"
}
```

## 6. 通用错误

| 状态 | 说明 |
| --- | --- |
| 400 | 请求参数不合法 |
| 401 | 管理会话无效 |
| 404 | 目标作品不存在 |
| 429 | 登录请求被限流 |
| 500 | 未分类服务端错误 |

当前全局 `500` 响应：

```json
{
  "message": "服务器内部错误。"
}
```

数据库只读、磁盘写入失败、格式错误的 JSON 等基础设施错误会进入全局错误处理。具体错误写入 API 标准错误日志，不向客户端暴露内部路径。

## 7. 调用示例

### 7.1 curl 登录并新增

```bash
curl -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"password":"change-me-now"}' \
  http://localhost:3000/api/auth/login

curl -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "示例项目",
    "description": "项目描述",
    "repoUrl": null,
    "liveUrl": "https://example.com",
    "techStack": ["Vue 3", "TypeScript"],
    "coverUrl": null,
    "problem": "要解决的问题",
    "role": "独立开发",
    "outcome": "已完成",
    "tags": ["frontend"],
    "featured": false,
    "published": true,
    "sortOrder": 0
  }' \
  http://localhost:3000/api/admin/projects
```

### 7.2 PowerShell 会话

```powershell
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/auth/login" `
  -Method Post `
  -WebSession $session `
  -ContentType "application/json" `
  -Body '{"password":"change-me-now"}'

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/admin/projects" `
  -WebSession $session
```

### 7.3 编辑作品

```bash
curl -b cookies.txt \
  -X PUT \
  -H "Content-Type: application/json" \
  -d @project.json \
  http://localhost:3000/api/admin/projects/PROJECT_ID
```

## 8. 数据库说明

表名：`projects`

JSON 字段 `tech_stack` 和 `tags` 在 SQLite 中以 JSON 字符串保存，API 层转换为数组。

服务端启用：

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
```

数据库文件通过 `DATABASE_PATH` 配置，默认是 `apps/api/data/portfolio.db`。

## 9. 已知限制

- 会话存储在单进程内存，不支持水平扩容。
- 不提供删除接口。
- 无字段级 PATCH。
- 无文件上传，封面只支持 URL。
- 无 CORS 白名单，默认按同域部署设计。
- 格式错误或超过请求体限制的 JSON 当前由全局错误处理返回通用 `500`。
- 未提供 API 版本前缀，例如 `/v1`。

