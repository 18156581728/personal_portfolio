# 技术设计

配合 `PRD.md` v1.1。前端 Vue 3 + TypeScript，后端 Node.js。作品数据走接口，不再写死在前台。

## 技术栈

| 层 | 选择 | 说明 |
| --- | --- | --- |
| 前台 | Vue 3、`<script setup lang="ts">`、Vue Router、Vite、Tailwind CSS v4 | 公开单页 + 隐藏管理路由 |
| 请求 | 浏览器 `fetch` + cookie 凭证 | 管理接口 `credentials: 'include'` |
| 后端 | Node.js + Fastify 或 Express（实现时二选一，默认 Fastify） | REST JSON |
| 数据 | SQLite（`better-sqlite3` 或 Prisma） | 单机部署足够；路径走环境变量 |
| 会话 | 服务端 session + HttpOnly cookie | 口令哈希比对，不明文存库 |
| 部署 | 前台静态或同源反代；API 与页面同域以免跨站 cookie 麻烦 | Nginx / Node 托管均可 |

## 仓库形态

建议 monorepo 两包，避免再在 React 目录里硬改：

```
apps/web/          Vue 3 前台与管理页
apps/api/          Node 接口
packages/shared/   作品字段类型（前后端共用）可选
```

一期也可以 `server/` + `src/` 单仓两个 Vite/Node 进程，用 `/api` 代理。

## 前台结构（web）

```
src/
  pages/
    HomePage.vue           # 公开作品集单页
    admin/
      LoginPage.vue
      ProjectListPage.vue
      ProjectFormPage.vue  # 新增 / 编辑
  components/              # Sidebar、About、Projects...
  composables/
    useActiveSection.ts
    usePrefersReducedMotion.ts
  data/                    # profile、skills、experience 静态
  api/projects.ts
  router.ts                # / 与 env 中的管理前缀
  App.vue
  main.ts
  index.css
```

- 管理路由 `meta.requiresAuth`。
- 路由 base 管理前缀来自 `VITE_ADMIN_PATH`（构建时注入，不出现在公开链接组件里）。

## 后端结构（api）

```
src/
  index.ts
  routes/auth.ts
  routes/projects.ts       # 公开 GET 与鉴权后的写
  middleware/session.ts
  db/schema.ts
  db/migrate.ts
```

### 接口

| 方法 | 路径 | 鉴权 | 作用 |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | 否（限流） | 校验 `ADMIN_TOKEN` / 口令，种 cookie |
| POST | `/api/auth/logout` | 是 | 清会话 |
| GET | `/api/auth/me` | 是 | 管理页探活 |
| GET | `/api/projects` | 否 | 仅 `published=true` |
| GET | `/api/admin/projects` | 是 | 全部，含草稿 |
| POST | `/api/admin/projects` | 是 | 新增 |
| PUT | `/api/admin/projects/:id` | 是 | 编辑 |
| DELETE | `/api/admin/projects/:id` | — | 一期不做 |

### 环境变量

```
ADMIN_PATH=_studio
ADMIN_PASSWORD=          # 只放服务器，不进 git
SESSION_SECRET=
DATABASE_URL=file:./data/portfolio.db
PORT=3000
```

口令用 Argon2 或 scrypt 哈希后比对；若只配明文环境变量，启动时哈希进内存，磁盘仍不存明文密码表。

## 作品表（以实现时你确认的字段为准）

最小集（你已指定 + 标题）：

- `id` TEXT PK
- `title` TEXT NOT NULL
- `description` TEXT NOT NULL
- `repo_url` TEXT NULL
- `live_url` TEXT NULL
- `created_at` / `updated_at`

已定稿字段：`tech_stack` JSON、`cover_url`、`problem`、`role`、`outcome`、`tags` JSON、`featured`、`published`、`sort_order`。不做起止时间。一期 API 提供新增与编辑，不提供删除。

## 安全

- 管理路径不进公开组件、sitemap、`robots.txt` 可 `Disallow` 该前缀。
- 写接口无 cookie 一律 401。
- 登录接口按 IP 限流。
- XSS：Vue 默认转义描述；管理端不做任意 HTML。
- CORS：若前后端分离，白名单你的域名且 `credentials: true`。

## 公开页布局（不变）

- `lg+`：左栏 sticky + 右栏滚动。
- `<lg`：顶栏 + 抽屉。
- 作品区数据改由 `GET /api/projects` 填充。
