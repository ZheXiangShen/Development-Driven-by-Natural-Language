# API 文档

Base URL: `http://localhost:3000`

## 1) 首页

- `GET /api/home`
- 响应：`HomeResponse`

```json
{
  "readingBooks": [],
  "activeUsers": [],
  "stories": [],
  "recommendBooks": []
}
```

## 2) 探索

- `GET /api/explore?theme=<string>&q=<string>`
- 查询参数：
  - `theme` 可选，主题筛选
  - `q` 可选，关键字
- 响应：`ExploreResponse`

## 3) 社区

- `GET /api/community?filter=<string>&q=<string>`
- 查询参数：
  - `filter` 可选（如：`全部`/`摘录`）
  - `q` 可选，关键字
- 响应：`CommunityResponse`

## 4) 消息列表

- `GET /api/messages?q=<string>`
- 查询参数：`q` 可选，按用户名/内容过滤
- 响应：`MessagesResponse`

## 5) 图书详情

- `GET /api/books/:bookId`
- 路径参数：`bookId` 图书 ID
- 响应：`BookDetailResponse`

## 6) 用户主页

- `GET /api/profile/:userId`
- 路径参数：`userId` 用户 ID
- 响应：`ProfileResponse`

## 7) 聊天

- `GET /api/chat/:userId`
  - 响应：`ChatResponse`
- `POST /api/chat/:userId`
  - 请求体：

```json
{
  "content": "你好，这本书还在吗？"
}
```

  - 失败响应（400）：

```json
{
  "error": "消息不能为空"
}
```

  - 成功响应（201）：

```json
{
  "message": {
    "id": "...",
    "sender": "me",
    "content": "你好，这本书还在吗？",
    "time": "20:30"
  }
}
```

## 8) 发布

- `GET /api/publish`
  - 响应：`PublishResponse`
- `POST /api/publish`
  - 请求体：`PublishPayload`

```json
{
  "publishType": "阅读痕迹",
  "bookTitle": "挪威的森林",
  "highlightText": "示例摘录",
  "noteText": "示例批注",
  "pageNum": "88",
  "selectedMoods": ["治愈"]
}
```

  - 失败响应（400）：

```json
{
  "error": "发布类型不能为空"
}
```

  - 成功响应（201）：

```json
{
  "item": {
    "id": "...",
    "publishType": "阅读痕迹",
    "createdAt": "..."
  }
}
```

## 类型定义

响应和请求类型集中在：`src/app/lib/api/types.ts`。
