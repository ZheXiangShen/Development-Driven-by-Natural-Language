# 项目工程规范（Social Reading App MVP）

## 1. 架构与分层

- 路由入口放在 `app/**/page.tsx`，尽量保持薄层。
- 页面业务逻辑放在 `src/app/pages/*`。
- API 协议层放在 `app/api/**/route.ts`，只做参数解析、状态码、返回体组装。
- 数据访问与聚合逻辑放在 `src/app/lib/api/*`。

## 2. 命名规范

- React 组件文件使用 `PascalCase.tsx`（如 `BookCard.tsx`）。
- hooks 文件使用 `useXxx.ts`（如 `useApiResource.ts`）。
- 业务工具模块使用 `kebab-case.ts`（如 `mock-db.ts`）。
- 路由动态参数统一资源语义（推荐 `bookId`、`userId`）。

## 3. 组件规范

- 优先提取可复用子组件，避免在页面中出现过长 JSX 片段。
- 组件保持单一职责，输入输出通过明确的 `props` 类型约束。
- 页面级状态和副作用尽量收敛在页面层，展示组件保持无状态。

## 4. API 与数据规范

- API 类型统一定义在 `src/app/lib/api/types.ts`。
- 所有 route handler 返回结构保持稳定，错误返回包含 `error` 字段。
- 新增接口必须同步更新 `docs/api.md`。

## 5. 样式规范

- 主题变量统一放在 `src/styles/theme.css`。
- 页面样式优先使用 Tailwind utility class。
- 避免引入未使用的 UI 组件库与样式依赖。

## 6. 质量门禁

- 提交前至少执行：`pnpm build`。
- 类型检查使用：`pnpm typecheck`。
- 重大重构后补充最小化链路验证（首页、探索、详情、发布、消息）。
