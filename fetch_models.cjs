const fs = require('fs');
const path = require('path');

const KEY = fs.readFileSync(path.join(__dirname, '.gw_auth'), 'utf8').trim();
const URL = 'https://newapi-bff.oneapis.cn/v1/models';

// 优先级从高到低的归类规则
const rules = [
  [/^wenxin:/i, 'image'],
  [/video|seedance|kling|sora|wan|hunyuan.?video|可灵|vid|视频/i, 'video'],
  [/image|flux|gpt-image|gemini.*image|dall|stable.?diffusion|imagen|sd-|cogview|diffus|绘画|画图/i, 'image'],
  [/suno|audio|tts|whisper|speech|voice|wav|语音|配音|music|音乐/i, 'audio'],
  [/jev|bocha|decision|neohrose|agent|搜索|search|plugin/i, 'agent'],
  [/chat|gpt|claude|qwen|glm|deepseek|llama|gemini|text|baichuan|mistral|yi-|abab|moonshot|minimax|ernie|doubao|豆包|sonnet|opus|turbo|kimi|sensenova|free|对话|语言/i, 'text'],
];

const CAP_META = {
  text:  { key:'text',  label:'文本对话',       en:'Language', icon:'chat',  desc:'GPT / Claude / DeepSeek / Kimi 等主流大语言模型，覆盖对话、写作、代码与复杂推理。' },
  image: { key:'image', label:'图像生成',       en:'Image',    icon:'image', desc:'GPT-Image、Gemini 图像、文心一格等，支持文生图与去字、扩图、重绘等图像编辑。' },
  video: { key:'video', label:'视频生成',       en:'Video',    icon:'video', desc:'豆包 Seedance、可灵 Kling 等，支持文生视频与图生视频多种能力。' },
  audio: { key:'audio', label:'音乐音频',       en:'Audio',    icon:'audio', desc:'Suno 音乐生成，由文本创作词曲，快速产出带人声的成品曲目。' },
  agent: { key:'agent', label:'智能体 / 搜索',  en:'Agent',    icon:'agent', desc:'JEV 搜索增强、决策模型等任务型插件，为对话补齐实时检索与工具调度。' },
};

(async () => {
  const res = await fetch(URL, { headers: { Authorization: 'Bearer ' + KEY } });
  const text = await res.text();
  process.stderr.write('status: ' + res.status + '\n');
  let json;
  try { json = JSON.parse(text); }
  catch (e) { process.stderr.write('body(not json): ' + text.slice(0, 400) + '\n'); process.exit(1); }

  let list = [];
  if (Array.isArray(json)) list = json;
  else if (json && Array.isArray(json.data)) list = json.data;

  const byCap = { text: [], image: [], video: [], audio: [], agent: [] };
  list.forEach((m) => {
    const id = (m.id || m.name || '').toString();
    let cap = 'agent';
    for (const [re, c] of rules) { if (re.test(id)) { cap = c; break; } }
    byCap[cap].push(id);
  });

  const data = Object.keys(CAP_META).map((k) => ({
    ...CAP_META[k],
    count: byCap[k].length,
    models: byCap[k],
    samples: byCap[k].slice(0, 6),
  }));

  const total = list.length;
  const out = { total, capabilities: data };
  fs.writeFileSync(path.join(__dirname, '_models_cache.json'), JSON.stringify(out, null, 2));

  // 生成 TS 数据文件（官网 import 用，不暴露 key）
  const ts =
`// 自动生成：拉取自 newapi-bff.oneapis.cn/v1/models（${new Date().toISOString().slice(0,10)}）
// 共 ${total} 个模型，按模型名自动归类五大能力。
export interface ModelCapability {
  key: 'text' | 'image' | 'video' | 'audio' | 'agent'
  label: string
  en: string
  icon: string
  desc: string
  count: number
  models: string[]
  samples: string[]
}

export const modelTotal = ${total}

export const modelCapabilities: ModelCapability[] = ${JSON.stringify(data, null, 2)}
`;
  fs.writeFileSync(path.join(__dirname, 'src/data/models.ts'), ts);

  process.stderr.write('done. total=' + total + ' byCap=' +
    JSON.stringify(Object.fromEntries(Object.entries(byCap).map(([k, v]) => [k, v.length]))) + '\n');
  process.stderr.write('written: src/data/models.ts\n');
})().catch((e) => { process.stderr.write('ERR: ' + e.message + '\n'); process.exit(1); });
