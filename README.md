# IdeaSpark

面向黑客松创客的灵感记录与创意激发工具。从灵感捕捉、选题评分、项目管理到路演复盘，覆盖黑客松完整生命周期。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + Vite |
| 后端 | Express (Node.js) |
| 数据库 | SQLite (better-sqlite3) |

## 快速开始

```bash
# 安装依赖
npm install && cd server && npm install && cd ../client && npm install && cd ..

# 启动开发服务
npm run dev
```

前端 `http://localhost:3000`，后端 `http://localhost:3001`。

桌面双击 `IdeaSpark.bat` 可直接启动。

## 功能总览

### 灵感激发
- **Dashboard** — 每日打卡、关键词组合、创意提示语、每日一词、随机挑战卡
- **强制联想引擎** — 随机配对两个不相关关键词，翻转动画展示
- **灵感词库** — 98 个技术关键词 + 51 条创意提示语，支持分类浏览和自定义添加
- **每日一词** — 每天推送技术名词 + 解释 + 创意问题

### 想法管理
- **写想法** — 标题 + 正文 + 标签 + 日期，支持 Markdown
- **快速模版** — 黑客松选题 / 日常灵感 / 项目复盘 三套引导模版
- **想法评分** — 可行性 / 影响力 / 创新度 / 个人热情 四维打分
- **版本历史** — 每次编辑自动保存旧版本，时间线回溯
- **历史浏览** — 日历热力图 + 全文搜索 + 标签筛选
- **关联图谱** — Canvas 力导向图展示想法之间的标签关联
- **分享导出** — 生成只读分享链接 + 导出 Markdown

### 黑客松项目管理
- **项目看板** — 三栏 Kanban（待做 / 进行中 / 已完成）
- **团队角色** — 队员名字 + 角色（前端/后端/设计/PM/路演）+ 职责 + 联系方式
- **时间线规划** — 输入比赛起止时间，自动生成 5 阶段时间分配表
- **每日站会** — 昨天/今天/障碍三栏记录，时间线视图
- **障碍追踪** — 四级严重度（阻塞/严重/中等/轻微），解决/未解决切换
- **竞品速查** — 竞品名称 / 优势 / 劣势 / 差异化表格
- **评审自评** — 5 个默认评审维度 + 权重 + 打分 + 说明
- **提交准备** — 7 项提交前 Checklist + 提交入口链接
- **路演练习** — 60 秒倒计时器 + 路演稿编辑器 + 技巧提示
- **项目复盘** — 做对/改进/学到/下次 + 星级评分 + 继续项目 toggle

### 开发辅助
- **代码片段库** — CRUD + 语言筛选 + 一键复制 + 关联项目
- **API 工具目录** — 20 个预置工具（Auth0/Stripe/Supabase 等）+ 分类筛选
- **技术栈对比** — 7 个常见组合 + 对比模式（并排比较优点/缺点/学习曲线）
- **重要链接簿** — GitHub / Figma / Devpost / API 文档分类收藏

### 习惯养成
- **连续打卡** — 每日打卡 + 30 天热力图 + 连续/累计天数
- **随机挑战卡** — 20 张创意约束卡（只用 CSS / 24h 极限 / 不用 npm / 离线可用...）

## 页面导航

| 页面 | 路由 | 说明 |
|---|---|---|
| 仪表盘 | `/` | 打卡、灵感、挑战、今日想法 |
| 写想法 | `/write` | 创建/编辑想法 + 评分 + 版本历史 |
| 历史 | `/history` | 日历 + 搜索 + 列表浏览 |
| 项目 | `/projects` | 项目列表 / 新建 |
| 项目详情 | `/projects/:id` | 6 Tab 项目空间 |
| 图谱 | `/graph` | 想法关联可视化 |
| 代码片段 | `/snippets` | 代码库 CRUD |
| 工具 | `/tools` | API 工具集 + 技术栈对比 |
| 路演 | `/pitch` | 60 秒发布会计时练习 |
| 灵感库 | `/inspiration` | 关键词 + 提示语词库 |

## 项目结构

```
IdeaSpark/
├── client/                    # React 前端
│   └── src/
│       ├── api/index.js       # API 调用封装
│       ├── pages/             # 10 个页面
│       │   ├── Dashboard.jsx
│       │   ├── WriteIdea.jsx
│       │   ├── History.jsx
│       │   ├── Projects.jsx
│       │   ├── ProjectDetail.jsx
│       │   ├── Graph.jsx
│       │   ├── Snippets.jsx
│       │   ├── Tools.jsx
│       │   ├── PitchTimer.jsx
│       │   └── InspirationLib.jsx
│       └── components/        # 25 个通用组件
├── server/                    # Express 后端
│   ├── routes/                # 15 个路由模块
│   │   ├── ideas.js           # 想法 CRUD + 日历
│   │   ├── inspirations.js    # 灵感素材
│   │   ├── projects.js        # 项目管理
│   │   ├── graph.js           # 关联图谱数据
│   │   ├── scores.js          # 想法评分
│   │   ├── standups.js        # 站会日志
│   │   ├── blockers.js        # 障碍追踪
│   │   ├── snippets.js        # 代码片段
│   │   ├── api-tools.js       # API 工具目录
│   │   ├── tech-stacks.js     # 技术栈对比
│   │   ├── more.js            # 挑战卡/模版/每日一词/打卡/分享/竞品/路演/版本历史
│   │   ├── team-roles.js      # 团队角色
│   │   ├── resource-links.js  # 资源链接
│   │   ├── judging.js         # 评审自评
│   │   ├── retrospectives.js  # 项目复盘
│   │   └── events.js          # 里程碑事件
│   ├── db.js                  # SQLite 初始化 + 迁移 + 种子数据
│   └── index.js               # 服务入口
├── data/                      # SQLite 数据库（运行时生成）
└── package.json               # 根脚本
```

## 数据库

16 张表：ideas, inspirations, projects, project_ideas, idea_scores, idea_history, standups, blockers, snippets, api_tools, project_api_tools, tech_stacks, challenges, templates, competitors, pitches, streak, team_roles, resource_links, judging_criteria_items, retrospectives, project_events

首次启动自动建表并填充种子数据。
