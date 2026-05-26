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

module.exports = db;
