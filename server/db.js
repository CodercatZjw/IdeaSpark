const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'ideaspark.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    date TEXT NOT NULL,
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS inspirations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'tech'
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    deadline TEXT,
    status TEXT DEFAULT 'planning',
    team_members TEXT DEFAULT '[]',
    tech_stack TEXT DEFAULT '[]',
    checklist TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    updated_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS project_ideas (
    project_id INTEGER NOT NULL,
    idea_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, idea_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS idea_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL UNIQUE,
    feasibility INTEGER DEFAULT 5,
    impact INTEGER DEFAULT 5,
    innovation INTEGER DEFAULT 5,
    passion INTEGER DEFAULT 5,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS idea_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER NOT NULL,
    title TEXT, content TEXT, tags TEXT,
    recorded_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS standups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    yesterday TEXT DEFAULT '',
    today TEXT DEFAULT '',
    blockers_text TEXT DEFAULT '',
    date TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS blockers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    description TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    resolved INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    language TEXT DEFAULT '',
    framework TEXT DEFAULT '',
    description TEXT DEFAULT '',
    code TEXT NOT NULL,
    source TEXT DEFAULT '',
    project_id INTEGER,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS api_tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    free_tier TEXT DEFAULT '',
    use_cases TEXT DEFAULT '',
    url TEXT DEFAULT '',
    category TEXT DEFAULT 'general',
    is_builtin INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS project_api_tools (
    project_id INTEGER NOT NULL,
    api_tool_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, api_tool_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (api_tool_id) REFERENCES api_tools(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tech_stacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    pros TEXT DEFAULT '[]',
    cons TEXT DEFAULT '[]',
    learning_curve TEXT DEFAULT 'medium',
    best_for TEXT DEFAULT '',
    community TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general'
  );

  CREATE TABLE IF NOT EXISTS templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    fields TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS competitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    name TEXT NOT NULL,
    strengths TEXT DEFAULT '',
    weaknesses TEXT DEFAULT '',
    differentiation TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS pitches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id INTEGER,
    project_id INTEGER,
    content TEXT DEFAULT '',
    duration INTEGER DEFAULT 60,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE SET NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS streak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE
  );
`);

// Seed inspirations if empty
const count = db.prepare('SELECT COUNT(*) as c FROM inspirations').get();
if (count.c === 0) {
  const keywords = [
    ['AI', 'tech'], ['边缘计算', 'tech'], ['Web3', 'tech'], ['IoT', 'tech'],
    ['量子计算', 'tech'], ['AR/VR', 'tech'], ['区块链', 'tech'], ['5G', 'tech'],
    ['机器人', 'tech'], ['生物技术', 'tech'], ['新能源', 'tech'], ['自动驾驶', 'tech'],
    ['数字孪生', 'tech'], ['隐私计算', 'tech'], ['Rust', 'tech'], ['WebAssembly', 'tech'],
    ['Serverless', 'tech'], ['Microservices', 'tech'], ['GraphQL', 'tech'], ['Kubernetes', 'tech'],
    ['零知识证明', 'tech'], ['联邦学习', 'tech'], ['合成数据', 'tech'], ['神经形态计算', 'tech'],
    ['气候科技', 'tech'], ['太空科技', 'tech'], ['脑机接口', 'tech'], ['纳米技术', 'tech'],
    ['开源', 'tech'], ['低代码/无代码', 'tech'], ['开发者工具', 'tech'], ['API经济', 'tech'],
    ['去中心化', 'tech'], ['DAO', 'tech'], ['NFT', 'tech'], ['DeFi', 'tech'],
    ['数字身份', 'tech'], ['可验证凭证', 'tech'], ['语义网', 'tech'], ['知识图谱', 'tech'],
    ['强化学习', 'tech'], ['大语言模型', 'tech'], ['多模态AI', 'tech'], ['AI Agent', 'tech'],
    ['RAG', 'tech'], ['向量数据库', 'tech'], ['提示工程', 'tech'], ['微调', 'tech'],
    ['可持续发展', 'business'], ['远程协作', 'business'], ['创作者经济', 'business'],
    ['共享经济', 'business'], ['订阅模式', 'business'], ['社区驱动', 'business'],
    ['开源商业化', 'business'], ['PLG', 'business'], ['社交电商', 'business'],
    ['游戏化', 'design'], ['极简主义', 'design'], ['无障碍设计', 'design'],
    ['声音交互', 'design'], ['情感设计', 'design'], ['包容性设计', 'design'],
    ['生物仿生设计', 'design'], ['生成式设计', 'design'], ['微交互', 'design'],
    ['思维上传', 'wild'], ['宠物翻译', 'wild'], ['梦境记录器', 'wild'],
    ['时间胶囊', 'wild'], ['气味互联网', 'wild'], ['情绪可视化', 'wild'],
    ['植物社交网络', 'wild'], ['重力控制', 'wild'], ['平行宇宙通讯', 'wild'],
    ['AI治理', 'tech'], ['具身智能', 'tech'], ['空间计算', 'tech'],
    ['Prompt as Code', 'tech'], ['本地优先', 'tech'], ['离线优先', 'tech'],
    ['端侧AI', 'tech'], ['Tauri', 'tech'], ['Zig', 'tech'], ['htmx', 'tech'],
    ['实时协作', 'tech'], ['CRDT', 'tech'], ['边缘AI', 'tech'], ['TinyML', 'tech'],
    ['Post-quantum crypto', 'tech'], ['同态加密', 'tech'], ['可观测性', 'tech'],
    ['eBPF', 'tech'], ['WASM', 'tech'], ['供应链安全', 'tech'], ['SBOM', 'tech'],
    ['绿色软件', 'tech'], ['碳感知计算', 'tech']
  ];

  const prompts = [
    ['如果你有100万开发者和一年时间，你会造什么？', 'wild'],
    ['哪个日常烦恼你愿意花三个月去解决？', 'general'],
    ['把你的专业技能 x 一个完全陌生的领域，交叉点能产生什么？', 'general'],
    ['五年后回看今天，什么技术会成为标配但现在还没人重视？', 'tech'],
    ['给10岁小孩解释你正在解决的问题，写下来', 'design'],
    ['选一个过时的产品，用今天的技术重新发明它', 'design'],
    ['如果AI完全接管编码，开发者还能创造什么独特价值？', 'tech'],
    ['什么事你重复做了三次以上，但还没人做过自动化？', 'general'],
    ['用三行伪代码描述一个改变十亿人生活的产品', 'general'],
    ['哪些"常识"其实是错的？基于这个洞察能造什么？', 'business'],
    ['你最讨厌用什么软件？重新设计它的体验', 'design'],
    ['选两个看起来毫无关系的API，把它们连起来能做什么？', 'tech'],
    ['如果你只能做一个按钮的产品，这个按钮做什么？', 'design'],
    ['什么数据现在被白白丢掉了，收集起来能创造价值？', 'business'],
    ['用一句话描述你心目中"不可能"的产品，然后想想第一步可以做什么', 'general'],
    ['把城市当作操作系统，你会给它装什么"App"？', 'wild'],
    ['为那些从不使用科技产品的人设计一个技术解决方案', 'design'],
    ['你上一次"wow"的瞬间是什么？能不能把它产品化？', 'general'],
    ['如果编程门槛降到零，世界会出现什么新问题？你又该如何解决它？', 'tech'],
    ['用不超过三个词定义下一次黑客松你要做的产品', 'general'],
    ['一个完全离线但能改变生活的产品', 'tech'],
    ['如何用AI重新定义"学习"这件事？', 'tech'],
    ['你身边有什么"大家都忍了但其实不该忍"的事？', 'general'],
    ['如果GitHub没有了，开发者协作会变成什么样？', 'tech'],
    ['给盲人做一个基于声音的黑客松项目', 'design'],
    ['把大自然中的某种机制翻译成软件系统', 'design'],
    ['什么工作人类做比AI好100倍？放大它', 'general'],
    ['当前最大的"技术浪费"是什么？能不能变废为宝？', 'tech'],
    ['用游戏的方式重新设计一个专业工具', 'design'],
    ['如果你要做一个永远不会有用户的APP，它会是什么？为什么？', 'wild'],
    ['选一个SDG目标，用三天写一个MVP', 'general'],
    ['黑客松评委最容易被什么打动？', 'general'],
    ['复盘你上一次黑客松经历：最大的时间浪费在哪？', 'general'],
    ['不用屏幕的交互方式有哪些新可能？', 'design'],
    ['一个普通人每天产生多少"数据废气"？能拿来做什么？', 'tech'],
    ['用区块链不是为了炒币，能做什么真有用的事？', 'tech'],
    ['当你不知道该做什么的时候，你通常会做什么？把它做成产品', 'general'],
    ['选一个emoji，围绕它设计一个完整的产品', 'design'],
    ['如果互联网从今天开始只能有10个网站，你会做哪个？', 'wild'],
    ['将两个最不相关的API融合，创造一个新产品', 'tech'],
    ['如何让非技术人员在24小时内成为"创客"？', 'design'],
    ['你所在城市最需要但还没有的数字化产品是什么？', 'business'],
    ['用不超过100行代码解决一个真实问题', 'tech'],
    ['如果让你做一个"反效率"的产品，会是什么？', 'design'],
    ['你最钦佩的创客是谁？他们会做什么样的项目？', 'general'],
    ['一个产品，目标用户只有10个人，但每人愿意付$1000/月', 'business'],
    ['如何把"等待"变成一个有价值的产品？', 'design'],
    ['选一个动物，模仿它的生存策略做一个产品', 'wild'],
    ['如果Siri/Alexa真的能理解你，你第一个会问什么？', 'tech'],
    ['用AI重新定义"教育"', 'tech'],
    ['你上一次被骗是什么时候？如何用技术防止它？', 'general']
  ];

  const insert = db.prepare('INSERT INTO inspirations (type, content, category) VALUES (?, ?, ?)');
  const seed = db.transaction(() => {
    for (const [content, category] of keywords) insert.run('keyword', content, category);
    for (const [content, category] of prompts) insert.run('prompt', content, category);
  });
  seed();
  console.log(`Seeded ${keywords.length} keywords + ${prompts.length} prompts`);
}

// Seed api_tools
const atCount = db.prepare('SELECT COUNT(*) as c FROM api_tools').get();
if (atCount.c === 0) {
  const tools = [
    ['Auth0', '身份认证即服务', '免费 7000 活跃用户/月', '用户登录、SSO、OAuth', 'https://auth0.com', 'auth'],
    ['Stripe', '在线支付处理', '交易额 2.9%+0.30 手续费', '订阅支付、一次性付款、发票', 'https://stripe.com', 'payment'],
    ['Supabase', '开源 Firebase 替代', '500MB 数据库 + 1GB 存储免费', '实时数据库、认证、文件存储', 'https://supabase.com', 'backend'],
    ['Firebase', 'Google 后端即服务', 'Spark 免费计划', '实时数据库、托管、云函数', 'https://firebase.google.com', 'backend'],
    ['Mapbox', '地图和定位服务', '每月 50000 次地图加载免费', '交互地图、地理编码、导航', 'https://mapbox.com', 'maps'],
    ['Twilio', '通信 API', '试用额度', '短信、语音、视频通话', 'https://twilio.com', 'communication'],
    ['Resend', '开发者邮件 API', '每天 100 封免费', '事务邮件、通知、验证码', 'https://resend.com', 'communication'],
    ['OpenAI API', '大语言模型 API', '注册送 $5 额度', '文本生成、代码补全、图像生成', 'https://platform.openai.com', 'ai'],
    ['Vercel', '前端部署平台', '免费计划支持自动部署', '静态网站、SSR、Edge Functions', 'https://vercel.com', 'hosting'],
    ['Cloudflare', 'CDN + Edge 平台', '免费计划含 CDN + Workers', 'CDN、DDoS 防护、边缘计算', 'https://cloudflare.com', 'infra'],
    ['Sentry', '错误追踪', '免费团队计划', '前端/后端错误监控、性能追踪', 'https://sentry.io', 'monitoring'],
    ['Algolia', '搜索即服务', '免费 10000 次搜索/月', '全文搜索、即时搜索体验', 'https://algolia.com', 'search'],
    ['Strapi', '开源 CMS', '完全免费自托管', '内容管理、API 自动生成', 'https://strapi.io', 'cms'],
    ['Pusher', '实时消息', '免费 20 万条消息/天', 'WebSocket、实时通知、聊天', 'https://pusher.com', 'realtime'],
    ['Hugging Face', 'ML 模型平台', '免费社区计划', '模型托管、推理 API、数据集', 'https://huggingface.co', 'ai'],
    ['Plaid', '金融数据 API', '沙盒环境免费', '银行账户连接、交易数据', 'https://plaid.com', 'fintech'],
    ['n8n', '工作流自动化', '完全免费自托管', '可视化自动化、API 编排', 'https://n8n.io', 'automation'],
    ['Upstash', 'Serverless 数据', '免费计划', 'Redis、Kafka、QStash', 'https://upstash.com', 'infra'],
    ['Clerk', 'React 身份认证', '免费 10000 月活用户', 'React 组件化认证、用户管理', 'https://clerk.com', 'auth'],
    ['Railway', '全栈部署平台', '$5 免费额度/月', '数据库、后端服务一键部署', 'https://railway.app', 'hosting']
  ];
  const insTool = db.prepare('INSERT INTO api_tools (name, description, free_tier, use_cases, url, category) VALUES (?,?,?,?,?,?)');
  const seedTools = db.transaction(() => { for (const t of tools) insTool.run(...t); });
  seedTools();
}

// Seed tech_stacks
const tsCount = db.prepare('SELECT COUNT(*) as c FROM tech_stacks').get();
if (tsCount.c === 0) {
  const stacks = [
    ['React + Firebase', '适合快速原型和中小型应用', '["前后端一体","实时数据","托管简单"]', '["冷启动慢","供应商锁定","复杂查询困难"]', '低', '黑客松、MVP、社交应用', '活跃'],
    ['Next.js + Supabase', 'React 全栈框架 + 开源后端', '["SSR/SSG","API Routes","PostgreSQL","开源"]', '["学习曲线","部署配置较多"]', '中', '全栈应用、内容网站、SaaS', '活跃'],
    ['Vue + Express + MongoDB', '灵活的前后端分离方案', '["灵活","文档友好","MongoDB 灵活"]', '["NoSQL 不适合所有场景","需要自己搭 CI/CD"]', '中', '仪表盘、后台管理、API 服务', '活跃'],
    ['SvelteKit + PocketBase', '轻量全栈，打包一个可执行文件', '["极致轻量","打包体积小","自带数据库和认证"]', '["生态较小","社区资源少"]', '低', '黑客松、小工具、个人项目', '成长中'],
    ['Tauri + Rust + SQLite', '桌面应用，体积极小', '["体积 < 10MB","性能极高","安全"]', '["Rust 学习曲线陡峭","Web 功能有限"]', '高', '桌面工具、系统应用、离线工具', '成长中'],
    ['Express + HTMX + SQLite', '极简全栈，适合后端开发者', '["零前端框架","页面加载快","代码量少"]', '["交互不如 SPA","不适合复杂 UI"]', '低', 'CRUD 应用、管理面板、内部工具', 'niche'],
    ['Flutter + Firebase', '跨平台移动应用开发', '["一套代码多端运行","热重载","UI 丰富"]', '["包体积大","Dart 生态小","原生功能受限"]', '中', '移动应用、跨平台 MVP', '活跃']
  ];
  const insTS = db.prepare('INSERT INTO tech_stacks (title, description, pros, cons, learning_curve, best_for, community) VALUES (?,?,?,?,?,?,?)');
  const seedTS = db.transaction(() => { for (const s of stacks) insTS.run(...s); });
  seedTS();
}

// Seed challenges
const chCount = db.prepare('SELECT COUNT(*) as c FROM challenges').get();
if (chCount.c === 0) {
  const challenges = [
    ['只用 HTML+CSS 实现，不允许任何 JavaScript', 'tech'],
    ['不许用任何第三方 npm 包或库', 'tech'],
    ['目标用户是色盲或视障群体', 'design'],
    ['必须在 24 小时内交付', 'general'],
    ['必须完全离线可用，不能依赖任何在线服务', 'tech'],
    ['代码总量不超过 500 行', 'tech'],
    ['UI 只能有 1 个按钮', 'design'],
    ['使用一个你从没用过的编程语言', 'tech'],
    ['产品面向 60 岁以上用户', 'design'],
    ['只能通过命令行交互，没有图形界面', 'tech'],
    ['所有数据必须存在 URL 里（无后端无数据库）', 'tech'],
    ['必须在手机上完全可用', 'design'],
    ['页面总大小（含所有资源）不超过 100KB', 'tech'],
    ['基于一个你讨厌的现有产品，重新设计它', 'design'],
    ['产品不能有任何文字，纯图标和图形交互', 'design'],
    ['针对一个非常小众的兴趣爱好做工具', 'general'],
    ['用游戏化的方式解决一个非游戏问题', 'design'],
    ['必须集成至少 3 个不同的公共 API', 'tech'],
    ['目标用户是说不同语言的人', 'design'],
    ['把你的项目变成物理世界的一部分（结合硬件/打印）', 'wild']
  ];
  const insCh = db.prepare('INSERT INTO challenges (content, category) VALUES (?,?)');
  const seedCh = db.transaction(() => { for (const c of challenges) insCh.run(...c); });
  seedCh();
}

// Seed templates
const tpCount = db.prepare('SELECT COUNT(*) as c FROM templates').get();
if (tpCount.c === 0) {
  const templates = [
    ['黑客松选题模版', 'hackathon_idea', JSON.stringify([
      { label: '要解决的问题', hint: '用一句话描述问题' },
      { label: '目标用户', hint: '谁会受益？' },
      { label: '解决方案', hint: '你的产品如何解决这个问题？' },
      { label: '技术栈', hint: '打算用什么技术？' },
      { label: '潜在风险', hint: '最大的挑战是什么？' }
    ])],
    ['日常灵感模版', 'daily_idea', JSON.stringify([
      { label: '一句话灵感', hint: '用一句话记下你的灵感' },
      { label: '展开描述', hint: '具体是什么样的产品/功能？' },
      { label: '下一步行动', hint: '如果要推进，第一步可以做什么？' }
    ])],
    ['项目复盘模版', 'retrospective', JSON.stringify([
      { label: '做了什么', hint: '这个项目/阶段完成了什么？' },
      { label: '学到了什么', hint: '技术、流程、协作方面的收获？' },
      { label: '做对了什么', hint: '哪些决策或做法值得保留？' },
      { label: '下次改进', hint: '如果重来一次，会改变什么？' }
    ])]
  ];
  const insTp = db.prepare('INSERT INTO templates (name, type, fields) VALUES (?,?,?)');
  const seedTp = db.transaction(() => { for (const t of templates) insTp.run(...t); });
  seedTp();
}

module.exports = db;
