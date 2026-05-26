# IdeaSpark

面向黑客松创客的灵感记录与激发工具。每日记录创意想法，搭配内置关键词和提示语引擎，帮助你在日常中积累创意、在需要时快速获得灵感。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite |
| 后端 | Express (Node.js) |
| 数据库 | SQLite (better-sqlite3) |

## 快速开始

```bash
# 安装依赖
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 启动开发服务（前后端同时启动）
npm run dev
```

前端运行在 `http://localhost:3000`，后端 API 运行在 `http://localhost:3001`。

## 功能

- **每日想法记录** — 标题 + 正文 + 标签，按日期管理创意
- **日历历史视图** — 日历热力图形式浏览哪天有过想法，点击筛选
- **灵感激发引擎** — 随机推荐 3 个关键词组合 + 1 条创意提示语
- **灵感词库** — 内置 98 个技术关键词 + 51 条创意提示语，支持分类浏览和自定义添加

## 项目结构

```
IdeaSpark/
├── client/               # React 前端
│   └── src/
│       ├── api/          # API 调用封装
│       ├── pages/        # Dashboard / WriteIdea / History / InspirationLib
│       └── components/   # Navbar
├── server/               # Express 后端
│   ├── routes/           # ideas + inspirations API
│   ├── db.js             # SQLite 初始化 + 种子数据
│   └── index.js          # 服务入口
├── data/                 # SQLite 数据库文件（运行时生成）
└── package.json          # 根脚本（concurrently 串联前后端）
```
