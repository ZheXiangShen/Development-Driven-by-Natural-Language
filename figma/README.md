# Social Reading App MVP (Next.js)

该项目是从 Figma 设计稿落地后的 Next.js App Router 应用，包含页面、BFF API 和 Prisma 持久化。

## 技术栈

- Next.js 14 (App Router)
- React 18
- TypeScript
- Prisma + SQLite
- Tailwind CSS v4

## 本地启动

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

默认地址：`http://localhost:3000`

## 常用命令

```bash
pnpm dev        # 开发环境
pnpm build      # 生产构建（含 Next 类型校验）
pnpm start      # 启动生产包
pnpm typecheck  # tsc 校验（禁用 incremental，避免 .next/types 缓存问题）
```

## 项目结构

```text
app/
  api/                 # App Router Route Handlers
  */page.tsx           # 路由入口（薄层）
src/app/
  pages/               # 页面主体组件
  components/          # 可复用 UI 组件
  hooks/               # 前端 hooks
  lib/api/             # API 数据访问与聚合逻辑
  data/                # mock 数据与类型
  lib/prisma.ts        # Prisma client 单例
src/styles/            # 全局样式与主题变量
prisma/schema.prisma   # 当前应用生效 schema
```

## 架构说明

- `app/**/page.tsx` 负责路由映射，页面逻辑集中在 `src/app/pages/*`。
- `app/api/**/route.ts` 负责协议层（参数解析、状态码），业务在 `src/app/lib/api/mock-db.ts`。
- 当前数据层通过 Prisma 访问 SQLite，首启会自动 seed。

## API 文档

详见 [docs/api.md](docs/api.md)。
