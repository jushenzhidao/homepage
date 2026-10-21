// 自动生成：拉取自 newapi-bff.oneapis.cn/v1/models（2026-10-21）
// 共 59 个模型，按模型名自动归类五大能力。
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

export const modelTotal = 59

export const modelCapabilities: ModelCapability[] = [
  {
    "key": "text",
    "label": "文本对话",
    "en": "Language",
    "icon": "chat",
    "desc": "GPT / Claude / DeepSeek / Kimi 等主流大语言模型，覆盖对话、写作、代码与复杂推理。",
    "count": 21,
    "models": [
      "claude-fable-5",
      "claude-opus-4-6",
      "claude-opus-4-7",
      "claude-opus-4-8",
      "claude-opus-5",
      "claude-sonnet-4-6",
      "deepseek-v4-flash",
      "deepseek-v4-pro",
      "free",
      "glm-5.2",
      "gpt-5.3-codex-spark",
      "gpt-5.4",
      "gpt-5.4-mini",
      "gpt-5.5",
      "gpt-5.6-luna",
      "gpt-5.6-sol",
      "gpt-5.6-terra",
      "gpt-6-astra",
      "kimi-k3",
      "MiniMax-H3",
      "sensenova-6.8-flash-lite"
    ],
    "samples": [
      "claude-fable-5",
      "claude-opus-4-6",
      "claude-opus-4-7",
      "claude-opus-4-8",
      "claude-opus-5",
      "claude-sonnet-4-6"
    ]
  },
  {
    "key": "image",
    "label": "图像生成",
    "en": "Image",
    "icon": "image",
    "desc": "GPT-Image、Gemini 图像、文心一格等，支持文生图与去字、扩图、重绘等图像编辑。",
    "count": 25,
    "models": [
      "gemini-3-pro-image-preview",
      "gemini-3.1-flash-image-preview",
      "gemini-3.1-flash-lite-image",
      "gpt-image-1",
      "gpt-image-1.5",
      "gpt-image-2",
      "gpt-image-2-vip",
      "gpt-image-2.5-flare",
      "gpt-image-2.5-sunburst",
      "wenxin:beauty",
      "wenxin:bgreplace",
      "wenxin:clarity",
      "wenxin:dewatermark",
      "wenxin:erase",
      "wenxin:expand",
      "wenxin:filter",
      "wenxin:matting",
      "wenxin:redraw",
      "wenxin:removetext",
      "wenxin:replace",
      "wenxin:restore",
      "wenxin:restyle",
      "wenxin:similar",
      "wenxin:sketch",
      "wenxin:textreplace"
    ],
    "samples": [
      "gemini-3-pro-image-preview",
      "gemini-3.1-flash-image-preview",
      "gemini-3.1-flash-lite-image",
      "gpt-image-1",
      "gpt-image-1.5",
      "gpt-image-2"
    ]
  },
  {
    "key": "video",
    "label": "视频生成",
    "en": "Video",
    "icon": "video",
    "desc": "豆包 Seedance、可灵 Kling 等，支持文生视频与图生视频多种能力。",
    "count": 5,
    "models": [
      "doubao-seedance-1-0-lite-t2v",
      "doubao-seedance-1-0-pro-250528",
      "doubao-seedance-1-5-pro-251215",
      "doubao-seedance-2-0-260128",
      "kling-video-v3-turbo"
    ],
    "samples": [
      "doubao-seedance-1-0-lite-t2v",
      "doubao-seedance-1-0-pro-250528",
      "doubao-seedance-1-5-pro-251215",
      "doubao-seedance-2-0-260128",
      "kling-video-v3-turbo"
    ]
  },
  {
    "key": "audio",
    "label": "音乐音频",
    "en": "Audio",
    "icon": "audio",
    "desc": "Suno 音乐生成，由文本创作词曲，快速产出带人声的成品曲目。",
    "count": 2,
    "models": [
      "suno_lyrics",
      "suno_music"
    ],
    "samples": [
      "suno_lyrics",
      "suno_music"
    ]
  },
  {
    "key": "agent",
    "label": "智能体 / 搜索",
    "en": "Agent",
    "icon": "agent",
    "desc": "JEV 搜索增强、决策模型等任务型插件，为对话补齐实时检索与工具调度。",
    "count": 6,
    "models": [
      "bocha-jev-v1",
      "decision-model-preview",
      "jev-1.13.0",
      "jev-latest",
      "jev-preview",
      "NeoHorse-Jev-4B"
    ],
    "samples": [
      "bocha-jev-v1",
      "decision-model-preview",
      "jev-1.13.0",
      "jev-latest",
      "jev-preview",
      "NeoHorse-Jev-4B"
    ]
  }
]
