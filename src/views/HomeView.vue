<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import qrUrl from '../assets/wechat-qr.png'

const WX_ID = 'Hedaofei0303'
const qrOpen = ref(false)
const copied = ref(false)
let copiedTimer: number | undefined

async function copyWx() {
  try {
    await navigator.clipboard.writeText(WX_ID)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = WX_ID
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
  copied.value = true
  if (copiedTimer !== undefined) window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => (copied.value = false), 2000)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') qrOpen.value = false
}

/* ---- 核心业务数据 ---- */
const biz = [
  {
    title: 'AI 模型聚合',
    desc: '100+ 主流模型统一 API 接入：文本、图像、视频、音乐与智能体，按量计费，一个密钥全通。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="5" r="1.8"/><circle cx="19" cy="5" r="1.8"/><circle cx="5" cy="19" r="1.8"/><circle cx="19" cy="19" r="1.8"/><path d="M6.4 6.4 10 10m4 0 3.6-3.6M6.4 17.6 10 14m4 0 3.6 3.6"/></svg>'
  },
  {
    title: '软件定制开发',
    desc: '网站、小程序、桌面应用与企业系统，从需求分析、方案设计到上线交付的全流程服务。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-4.5 4L8 16"/><path d="m16 8 4.5 4L16 16"/><path d="m13.2 5-2.4 14"/></svg>'
  },
  {
    title: 'AI 能力集成',
    desc: '为既有产品接入大模型能力：智能对话、内容生成、知识库问答，不改动主体架构平滑升级。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 10h4v4h-4z"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>'
  },
  {
    title: '基础设施与网关',
    desc: 'API 网关搭建、统一认证 SSO、计费与用量体系、部署运维与性能优化，企业级就绪。',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01M11 7.5h4M11 16.5h4"/></svg>'
  }
]

const chips = ['Web 应用', '微信小程序', '桌面应用', 'AI 应用', 'API 网关', '企业系统']

const steps = [
  { t: '需求沟通', d: '微信直连，快速厘清目标与边界' },
  { t: '方案报价', d: '输出技术方案与透明报价，无隐藏项' },
  { t: '开发交付', d: '小步快跑，阶段演示，按里程碑验收' },
  { t: '维护迭代', d: '上线不是终点，持续保障与功能演进' }
]

/* ---- 滚动入场：IntersectionObserver 一次性揭示 ---- */
let io: IntersectionObserver | null = null

/* ---- reduced-motion：暂停背景视频 ---- */
let mm: MediaQueryList | null = null
let mediaSync: (() => void) | null = null

/* ---- 入场时间线退役 ---- */
let enteredTimer: number | undefined
let footEl: HTMLElement | null = null
let finished = false

function markEntered() {
  if (finished) return
  finished = true
  if (enteredTimer !== undefined) window.clearTimeout(enteredTimer)
  document.documentElement.classList.add('is-entered')
}

onMounted(() => {
  window.addEventListener('keydown', onKey)

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io?.unobserve(e.target)
        }
      }
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll('.reveal').forEach((el) => io?.observe(el))

  const video = document.querySelector<HTMLVideoElement>('video.art')
  mm = window.matchMedia('(prefers-reduced-motion:reduce)')
  mediaSync = () => {
    if (!video || !mm) return
    if (mm.matches) video.pause()
    else video.play()?.catch(() => {})
  }
  mediaSync()
  if (mm.addEventListener) mm.addEventListener('change', mediaSync)
  else (mm as MediaQueryList & { addListener(cb: () => void): void }).addListener(mediaSync)

  footEl = document.getElementById('foot2')
  footEl?.addEventListener('animationend', markEntered, { once: true })
  enteredTimer = window.setTimeout(markEntered, 4000)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  io?.disconnect()
  if (copiedTimer !== undefined) window.clearTimeout(copiedTimer)
  if (mm && mediaSync) {
    if (mm.removeEventListener) mm.removeEventListener('change', mediaSync)
    else (mm as MediaQueryList & { removeListener(cb: () => void): void }).removeListener(mediaSync)
  }
  footEl?.removeEventListener('animationend', markEntered)
  if (enteredTimer !== undefined) window.clearTimeout(enteredTimer)
})
</script>

<template>
  <div class="page">
    <div class="stage">
      <video
        class="art" autoplay muted loop playsinline preload="auto" aria-hidden="true"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      ></video>
      <div class="veil"></div>

      <header class="bar">
        <a class="brand" href="#">
          <svg viewBox="0 0 23 17" aria-hidden="true">
            <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z"/>
            <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z"/>
            <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z"/>
            <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z"/>
          </svg>
          <span id="word">ONEAPIS</span>
        </a>
      </header>

      <main class="hero">
        <h1 class="title"><span id="h1a">全量 AI 模型，一个接口。</span>
          <span id="h1b">准时交付，精准命中。</span></h1>
        <p class="sub"><span id="sub1">文本、图像、视频、音乐与智能体 —</span>
          <span id="sub2">统一接入同一个网关。</span></p>
        <a class="cta" href="#custom"><span id="cta">立即开始</span>
          <svg class="arrow" viewBox="0 0 16 11" aria-hidden="true">
            <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8"/></svg></a>
        <ul class="feats">
          <li><svg class="chev" viewBox="0 0 11 20" aria-hidden="true"><path d="M1.15 1.15 L9.6 10 L1.15 18.85"/></svg><span id="f1">统一 API 网关</span></li>
          <li><svg class="chev" viewBox="0 0 11 20" aria-hidden="true"><path d="M1.15 1.15 L9.6 10 L1.15 18.85"/></svg><span id="f2">100+ 模型</span></li>
          <li><svg class="chev" viewBox="0 0 11 20" aria-hidden="true"><path d="M1.15 1.15 L9.6 10 L1.15 18.85"/></svg><span id="f3">按量计费</span></li>
          <li><svg class="chev" viewBox="0 0 11 20" aria-hidden="true"><path d="M1.15 1.15 L9.6 10 L1.15 18.85"/></svg><span id="f4">企业级就绪</span></li>
        </ul>
        <span class="rule" aria-hidden="true"></span>
      </main>
    </div>

    <section class="biz">
      <div class="wrap">
        <p class="eyebrow reveal">OUR BUSINESS</p>
        <h2 class="sec-title reveal">核心业务</h2>
        <p class="sec-sub reveal">以 AI 为核心引擎，覆盖从基础设施到落地应用的完整链路。</p>
        <div class="biz-grid">
          <article class="biz-card reveal" v-for="b in biz" :key="b.title">
            <span class="biz-icon" v-html="b.icon"></span>
            <h3>{{ b.title }}</h3>
            <p>{{ b.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="custom" id="custom">
      <div class="wrap custom__inner">
        <div class="custom__copy">
          <p class="eyebrow reveal">CUSTOM DEVELOPMENT</p>
          <h2 class="sec-title reveal">软件定制化开发</h2>
          <p class="sec-sub reveal">小团队，快响应 — 把你的想法做成能用的产品。</p>
          <ul class="chips reveal">
            <li v-for="c in chips" :key="c">{{ c }}</li>
          </ul>
          <button class="cta2 reveal" @click="qrOpen = true">
            <span>微信联系合作</span>
            <svg viewBox="0 0 16 11" aria-hidden="true">
              <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8"/></svg>
          </button>
        </div>
        <ol class="steps reveal">
          <li v-for="(s, i) in steps" :key="s.t">
            <span class="step-num">0{{ i + 1 }}</span>
            <b>{{ s.t }}</b>
            <p>{{ s.d }}</p>
          </li>
        </ol>
      </div>
    </section>

    <footer class="foot">
      <span id="foot1">全球创新团队的共同选择。</span>
      <a class="contact" href="#" @click.prevent="qrOpen = true"><span id="footc">联系销售 · 微信 Hedaofei0303</span></a>
      <span id="foot2">2026</span>
    </footer>

    <div v-if="qrOpen" class="wx-modal" @click.self="qrOpen = false">
      <div class="wx-scrim" @click="qrOpen = false"></div>
      <div class="wx-card" role="dialog" aria-modal="true" aria-label="微信联系销售">
        <button class="wx-close" aria-label="关闭" @click="qrOpen = false">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1 L11 11 M11 1 L1 11"/></svg>
        </button>
        <p class="wx-title">微信联系销售</p>
        <span class="wx-qr-frame">
          <img class="wx-qr" :src="qrUrl" alt="微信二维码" width="240" height="240"/>
        </span>
        <div class="wx-idrow">
          <span class="wx-idlabel">微信号</span>
          <span class="wx-id">Hedaofei0303</span>
          <button class="wx-copy" @click="copyWx">{{ copied ? '已复制' : '复制' }}</button>
        </div>
        <p class="wx-hint">微信扫一扫 · 添加好友</p>
      </div>
    </div>
  </div>
</template>

<style>
/* ================= 2. DESIGN TOKENS ================= */
:root{
  --ink:#ffffff; --sub:#a2a9b8; --nav:#fbfdff; --foot:#f4f8fd;
  --hair:rgba(196,214,232,.72); --chev:rgba(214,232,250,.90);
  --navdim:#e8ecf0; --feat:#e2ebf5;
  --veil:6,10,18;
}
/* ================= 3. SCALE SYSTEM ================= */
:root{
  --cover:max(calc(100vw / 1536), calc(100vh / 1024));
  --fit:calc(100vh / 910);
  --u:min(var(--cover), var(--fit));
  --blur:calc(var(--u)*26);
  --glow:calc(var(--u)*34);
  --hairline:max(1px, calc(var(--u)*1.6));
}
@supports (height:100dvh){
  :root{
    --cover:max(calc(100vw / 1536), calc(100dvh / 1024));
    --fit:calc(100dvh / 910);
  }
}
h1,h2,h3,p,ul,ol{margin:0;padding:0}
li{list-style:none}
a{color:inherit;text-decoration:none}
button{font:inherit}
a:focus-visible,button:focus-visible{outline:2px solid #9fe0ff;outline-offset:3px;border-radius:4px}
html{scroll-behavior:smooth}
/* 组件根壳透明化 */
.page{display:contents}

/* ================= 4. STAGE（视频 Hero 舞台，随页滚动） ================= */
.stage{position:relative;overflow:hidden;height:calc(var(--u)*1024);background:#03060c}
.art{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 50%;z-index:0;user-select:none;
  -webkit-user-drag:none;pointer-events:none;background:#03060c;
}
.veil{
  position:absolute;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(140% 60% at 50% 40%,
        rgba(var(--veil),.16) 0%, rgba(var(--veil),.057) 50%,
        rgba(var(--veil),0) 100%),
    linear-gradient(180deg, rgba(var(--veil),0) 45%,
        rgba(var(--veil),.10) 100%),
    linear-gradient(180deg, rgba(var(--veil),0) 78%,
        rgba(4,7,15,.9) 100%);
}
.bar,.hero{position:absolute;z-index:1}

/* ================= 5. COMPONENT SKIN ================= */
.brand svg{fill:var(--ink);display:block}
.chev{fill:none;stroke:var(--chev);stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
.cta .arrow{fill:none;stroke:var(--ink);stroke-width:1.6;stroke-linecap:square;stroke-linejoin:miter}
.rule{background:linear-gradient(180deg,
    rgba(186,200,214,.70) 0%,rgba(206,220,232,.92) 52%,
    rgba(182,198,212,.68) 100%)}

.cta{
  border-radius:999px;
  background:
    linear-gradient(180deg, rgba(6,12,22,0) 45%, rgba(6,12,22,.12) 78%,
                            rgba(6,12,22,.28) 100%),
    linear-gradient(90deg,
      rgba(255,226,178,.17) 0%,  rgba(255,236,208,.07) 22%,
      rgba(176,206,238,.03) 55%, rgba(150,196,244,.09) 100%),
    linear-gradient(90deg,
      rgba(255,255,255,.24) 0%,  rgba(255,255,255,.17) 12%,
      rgba(255,255,255,.11) 26%, rgba(255,255,255,.07) 42%,
      rgba(255,255,255,.05) 60%, rgba(255,255,255,.04) 80%,
      rgba(255,255,255,.04) 100%);
  -webkit-backdrop-filter:blur(var(--blur)) saturate(.45);
  backdrop-filter:blur(var(--blur)) saturate(.45);
  box-shadow:0 calc(var(--u)*-2) calc(var(--u)*20) rgba(255,224,176,.20),
             0 0 var(--glow) rgba(168,204,252,.16),
             inset 0 var(--hairline) 0 0 rgba(255,251,242,.45);
}
.cta::before{
  content:'';position:absolute;inset:0;border-radius:inherit;
  padding:var(--hairline);pointer-events:none;
  background:
    linear-gradient(180deg, rgba(255,252,246,.95) 0%,
        rgba(255,252,246,.20) 45%, rgba(255,252,246,0) 78%),
    linear-gradient(90deg,
      rgba(255,228,182,.95) 0%,  rgba(250,236,210,.70) 12%,
      rgba(226,230,234,.03) 32%, rgba(214,226,240,.02) 62%,
      rgba(200,228,250,.70) 90%, rgba(186,224,247,.95) 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  -webkit-mask-composite:xor;
  mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
  mask-composite:exclude;
}

/* PER-ELEMENT VARIABLE WEIGHTS */
#word      {font-variation-settings:'wght' 531;color:var(--ink)}
#h1a,#h1b  {font-variation-settings:'wght' 424;color:var(--ink)}
#sub1,#sub2{font-variation-settings:'wght' 446;color:var(--sub)}
#cta       {font-variation-settings:'wght' 497;color:var(--ink)}
#f1,#f2,#f3,#f4{font-variation-settings:'wght' 534;color:var(--feat)}
#foot1,#footc,#foot2{font-variation-settings:'wght' 521;color:var(--foot)}

/* ================= 5.5 新增区块（滚动内容） ================= */
.biz{position:relative;z-index:1;padding:110px 24px;
  background:
    radial-gradient(60% 50% at 12% 0%, rgba(249,115,22,.055), transparent 60%),
    radial-gradient(50% 45% at 92% 18%, rgba(96,165,250,.05), transparent 60%),
    #04070f}
.custom{position:relative;z-index:1;padding:110px 24px 130px;
  background:linear-gradient(180deg,#04070f 0%,#060b18 100%)}
.wrap{max-width:1160px;margin:0 auto}
.eyebrow{font-size:12px;letter-spacing:.35em;color:#fb923c;
  font-variation-settings:'wght' 581;margin-bottom:14px}
.sec-title{font-size:clamp(26px,3.4vw,40px);line-height:1.2;color:var(--ink);
  font-variation-settings:'wght' 531;letter-spacing:.02em}
.sec-sub{margin-top:12px;font-size:clamp(14px,1.4vw,16.5px);line-height:1.7;
  color:var(--sub);font-variation-settings:'wght' 446;max-width:34em}

.biz-grid{margin-top:52px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.biz-card{padding:30px 26px;border-radius:18px;
  background:rgba(255,255,255,.028);
  border:1px solid rgba(196,214,232,.13);
  transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease,background .3s ease}
.biz-card:hover{transform:translateY(-5px);border-color:rgba(196,214,232,.32);
  background:rgba(255,255,255,.045);
  box-shadow:0 18px 44px rgba(2,6,14,.5)}
.biz-icon{display:inline-flex;align-items:center;justify-content:center;
  width:52px;height:52px;border-radius:14px;margin-bottom:20px;
  background:rgba(249,115,22,.10);color:#fb923c}
.biz-icon svg{width:26px;height:26px}
.biz-card h3{font-size:17px;font-variation-settings:'wght' 560;color:var(--ink);
  letter-spacing:.02em;margin-bottom:10px}
.biz-card p{font-size:13.5px;line-height:1.75;color:var(--sub);
  font-variation-settings:'wght' 446}

.custom__inner{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);
  gap:64px;align-items:start}
.chips{margin-top:26px;display:flex;flex-wrap:wrap;gap:10px}
.chips li{padding:9px 18px;border-radius:999px;font-size:13px;
  font-variation-settings:'wght' 506;color:var(--feat);
  border:1px solid rgba(196,214,232,.22);background:rgba(255,255,255,.035);
  transition:border-color .2s ease,color .2s ease}
.chips li:hover{border-color:rgba(251,146,60,.55);color:#fdba74}
.cta2{margin-top:36px;display:inline-flex;align-items:center;gap:12px;cursor:pointer;
  padding:15px 30px;border-radius:999px;color:var(--ink);font-size:15px;
  font-variation-settings:'wght' 531;letter-spacing:.06em;
  border:1px solid rgba(196,214,232,.35);background:rgba(255,255,255,.05);
  transition:background .2s ease,transform .2s ease,border-color .2s ease}
.cta2:hover{background:rgba(255,255,255,.1);border-color:rgba(196,214,232,.6);
  transform:translateY(-2px)}
.cta2:active{transform:translateY(0)}
.cta2 svg{width:16px;height:11px;fill:none;stroke:currentColor;stroke-width:1.6;
  stroke-linecap:square;stroke-linejoin:miter}

.steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:34px 44px;
  padding-top:8px}
.steps li{position:relative;padding-left:0}
.step-num{display:block;font-size:34px;line-height:1;margin-bottom:12px;
  font-variation-settings:'wght' 300;color:rgba(251,146,60,.85)}
.steps b{display:block;font-size:16px;font-variation-settings:'wght' 560;
  color:var(--ink);letter-spacing:.04em;margin-bottom:8px}
.steps p{font-size:13.5px;line-height:1.7;color:var(--sub);
  font-variation-settings:'wght' 446}

/* 滚动入场（reduced-motion 下由全局重置保证元素直接可见） */
@media (prefers-reduced-motion:no-preference){
  .reveal{opacity:0;transform:translateY(24px);
    transition:opacity .8s cubic-bezier(.25,.8,.35,1),transform .8s cubic-bezier(.25,.8,.35,1)}
  .reveal.in{opacity:1;transform:none}
  .biz-grid .reveal:nth-child(2){transition-delay:.08s}
  .biz-grid .reveal:nth-child(3){transition-delay:.16s}
  .biz-grid .reveal:nth-child(4){transition-delay:.24s}
  .steps .reveal:nth-child(2){transition-delay:.08s}
  .steps .reveal:nth-child(3){transition-delay:.16s}
  .steps .reveal:nth-child(4){transition-delay:.24s}
}

/* ================= 5.6 页脚（文档流） ================= */
.foot{position:relative;z-index:1;text-align:center;
  padding:64px 24px 56px;background:#03060d;
  border-top:1px solid rgba(196,214,232,.10)}
#foot1{display:block;font-size:15px;letter-spacing:.08em}
.contact{display:inline-block;margin:16px 0 12px}
#footc{display:inline-block;font-size:15px;letter-spacing:.08em;
  text-decoration:underline;text-underline-offset:.35em;
  text-decoration-color:rgba(196,214,232,.4);transition:color .15s ease}
#footc:hover{color:var(--ink)}
#foot2{display:block;font-size:13.5px;letter-spacing:.14em;
  color:rgba(244,248,253,.5)}

/* ================= 6. ENTRANCE SEQUENCE ================= */
@media (prefers-reduced-motion:no-preference){
  :root{
    --ent-line:cubic-bezier(.16,1,.3,1);
    --ent-soft:cubic-bezier(.25,.8,.35,1);
    --rise:9px;
  }
  @keyframes en-wipe{
    from{clip-path:inset(-.78em 0 calc(100% + .78em) 0);translate:0 var(--rise)}
    to  {clip-path:inset(-.78em 0 -.78em 0);translate:0 0}
  }
  @keyframes en-lift{from{opacity:0;translate:0 var(--rise)}}
  @keyframes en-draw{from{scale:1 0}}

  html:not(.is-entered) .brand                 {animation:en-lift  .60s var(--ent-soft) .12s backwards}
  html:not(.is-entered) #h1a                   {animation:en-wipe  .95s var(--ent-line) .34s backwards}
  html:not(.is-entered) #h1b                   {animation:en-wipe  .95s var(--ent-line) .44s backwards}
  html:not(.is-entered) #sub1                  {animation:en-lift  .70s var(--ent-soft) .74s backwards}
  html:not(.is-entered) #sub2                  {animation:en-lift  .70s var(--ent-soft) .80s backwards}
  html:not(.is-entered) .cta                   {animation:en-lift  .80s var(--ent-line) .94s backwards}
  html:not(.is-entered) .feats li:nth-child(1) {animation:en-lift  .60s var(--ent-soft) 1.08s backwards}
  html:not(.is-entered) .feats li:nth-child(2) {animation:en-lift  .60s var(--ent-soft) 1.15s backwards}
  html:not(.is-entered) .feats li:nth-child(3) {animation:en-lift  .60s var(--ent-soft) 1.22s backwards}
  html:not(.is-entered) .feats li:nth-child(4) {animation:en-lift  .60s var(--ent-soft) 1.29s backwards}
  html:not(.is-entered) .rule                  {animation:en-draw  .55s var(--ent-line) 1.34s backwards;transform-origin:top}
}

/* ================= 7. LOCKED (desktop) ================= */
@media (min-width:1200px) and (min-height:560px) and (min-aspect-ratio:100/95){
  .bar,.hero{left:50%;width:calc(var(--u)*1536);transform:translateX(-50%)}
  .bar{top:0;height:calc(var(--u)*120)}
  .hero{top:0;height:calc(var(--u)*1024)}
  .bar > *,.hero > *{position:absolute}
  .title,.sub,.feats{inset:0;font-weight:inherit}
  .bar span,.title span,.sub span,.feats span,.cta span{
    position:absolute;line-height:0;white-space:nowrap}

  .brand{left:calc(var(--u)*221);top:calc(var(--u)*55);
    display:flex;align-items:center;gap:calc(var(--u)*7)}
  .brand svg{width:calc(var(--u)*23);height:calc(var(--u)*17)}
  #word{position:relative;font-size:calc(var(--u)*23.4);letter-spacing:calc(var(--u)*3.2)}

  #h1a{left:0;right:0;text-align:center;top:calc(var(--u)*285.222);
    font-size:calc(var(--u)*46.8);letter-spacing:calc(var(--u)*1);transform:translateX(calc(var(--u)*-1))}
  #h1b{left:0;right:0;text-align:center;top:calc(var(--u)*335.222);
    font-size:calc(var(--u)*46.8);letter-spacing:calc(var(--u)*0.5);transform:translateX(calc(var(--u)*-3))}
  #sub1{left:0;right:0;text-align:center;top:calc(var(--u)*408.115);
    font-size:calc(var(--u)*20.6);letter-spacing:calc(var(--u)*0.8);transform:translateX(calc(var(--u)*-0.5))}
  #sub2{left:0;right:0;text-align:center;top:calc(var(--u)*432.153);
    font-size:calc(var(--u)*19.1);letter-spacing:calc(var(--u)*0.8);transform:translateX(calc(var(--u)*-2))}

  .cta{left:calc(var(--u)*625.8);top:calc(var(--u)*555.2);
    width:calc(var(--u)*279.6);height:calc(var(--u)*46.6)}
  #cta{left:0;right:0;text-align:center;top:calc(var(--u)*23.113);
    font-size:calc(var(--u)*22);letter-spacing:calc(var(--u)*2);transform:translateX(calc(var(--u)*-12))}
  .cta .arrow{position:absolute;left:calc(var(--u)*230.8);top:calc(var(--u)*17.8);
    width:calc(var(--u)*16);height:calc(var(--u)*11)}

  .feats li{position:absolute;width:calc(var(--u)*220);height:calc(var(--u)*20)}
  .feats .chev{position:absolute;left:0;top:0;width:calc(var(--u)*11);height:calc(var(--u)*20)}
  .feats li:nth-child(1){left:calc(var(--u)*360); top:calc(var(--u)*718)}
  .feats li:nth-child(2){left:calc(var(--u)*590); top:calc(var(--u)*719)}
  .feats li:nth-child(3){left:calc(var(--u)*803); top:calc(var(--u)*721)}
  .feats li:nth-child(4){left:calc(var(--u)*1013);top:calc(var(--u)*722)}
  #f1{left:calc(var(--u)*26);top:calc(var(--u)*11.266);font-size:calc(var(--u)*14.6);letter-spacing:calc(var(--u)*0.8)}
  #f2{left:calc(var(--u)*26);top:calc(var(--u)*11.266);font-size:calc(var(--u)*14.6);letter-spacing:calc(var(--u)*0.8)}
  #f3{left:calc(var(--u)*26);top:calc(var(--u)*11.266);font-size:calc(var(--u)*14.6);letter-spacing:calc(var(--u)*0.8)}
  #f4{left:calc(var(--u)*29);top:calc(var(--u)*11.266);font-size:calc(var(--u)*14.6);letter-spacing:calc(var(--u)*0.8)}

  .rule{left:calc(var(--u)*767);top:calc(var(--u)*792);
    width:calc(var(--u)*1);height:calc(var(--u)*57)}
}

/* ================= 8. FLOW ================= */
@media (max-width:1199px),(max-height:559px),(max-aspect-ratio:100/95){
  :root{--c:min(calc(100vw / 430), calc(100vh / 860))}
  .stage{height:100svh}
  .bar{left:0;right:0;top:0;height:auto;
    padding:calc(env(safe-area-inset-top) + calc(var(--c)*24)) calc(var(--c)*22) 0;
    display:flex;align-items:center}
  .hero{left:0;right:0;top:0;bottom:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;text-align:center;
    padding:calc(env(safe-area-inset-top) + calc(var(--c)*60)) calc(var(--c)*22)
            calc(var(--c)*40);
    gap:calc(var(--c)*20)}
  .brand{display:flex;align-items:center;gap:calc(var(--c)*8)}
  .brand svg{width:calc(var(--c)*22);height:auto}
  #word{font-size:calc(var(--c)*19);letter-spacing:.06em}

  .title{font-size:calc(var(--c)*33);line-height:1.25;max-width:15ch}
  .sub{color:var(--sub);font-size:calc(var(--c)*17);line-height:1.45;max-width:26ch}
  .cta{position:relative;display:inline-flex;align-items:center;
       gap:calc(var(--c)*12);padding:calc(var(--c)*16) calc(var(--c)*26);
       font-size:calc(var(--c)*18)}
  .cta .arrow{width:calc(var(--c)*16);height:calc(var(--c)*11)}
  .feats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
    gap:calc(var(--c)*15) calc(var(--c)*13);width:100%;
    max-width:calc(var(--c)*400);margin-top:calc(var(--c)*6)}
  .feats li{display:flex;align-items:center;gap:calc(var(--c)*9);
            font-size:calc(var(--c)*14)}
  .feats .chev{width:calc(var(--c)*9);height:calc(var(--c)*16);flex:none}
  .rule{width:1px;height:calc(var(--c)*33);margin:calc(var(--c)*19) auto 0}

  .biz,.custom{padding:72px 20px}
  .custom{padding-bottom:96px}
  .biz-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:40px}
  .biz-card{padding:24px 20px;border-radius:16px}
  .custom__inner{grid-template-columns:1fr;gap:48px}
  .steps{gap:28px 32px}

  /* --- B1. PHONE CANVAS --- */
  @media (max-width:599px),(max-height:429px){
    :root{--c:min(calc(100vw / 360), calc(100vh / 770), 1px);--rise:6px}

    .veil{background:
      radial-gradient(130% 44% at 50% 45%,
          rgba(var(--veil),.50) 0%, rgba(var(--veil),.26) 55%,
          rgba(var(--veil),0) 100%),
      linear-gradient(180deg,
          rgba(var(--veil),.34) 0%, rgba(var(--veil),0) 20%,
          rgba(var(--veil),0) 60%, rgba(var(--veil),.55) 100%)}

    .hero{gap:calc(var(--c)*22)}
    .title{font-size:calc(var(--c)*32);line-height:1.32;letter-spacing:.01em;
           max-width:none;text-wrap:balance}
    .title span{display:block}
    .sub{font-size:calc(var(--c)*16);line-height:1.5;max-width:none;
         text-wrap:balance}
    .sub span{display:block}
    .cta{font-size:calc(var(--c)*16.5);padding:calc(var(--c)*15) calc(var(--c)*28);
         gap:calc(var(--c)*12)}
    .cta .arrow{width:calc(var(--c)*17);height:calc(var(--c)*12)}
    .feats{grid-template-columns:repeat(2,max-content);justify-content:center;
      width:auto;max-width:none;gap:calc(var(--c)*16) calc(var(--c)*16);
      margin-top:calc(var(--c)*22)}
    .feats li{font-size:calc(var(--c)*13);gap:calc(var(--c)*10)}
    .feats .chev{width:calc(var(--c)*10);height:calc(var(--c)*18)}
    .rule{height:calc(var(--c)*30);margin:calc(var(--c)*28) auto 0}
    .biz-grid{grid-template-columns:1fr}
    .steps{grid-template-columns:1fr 1fr}
  }

  /* --- LANDSCAPE PHONES --- */
  @media (max-height:429px) and (min-aspect-ratio:1/1){
    :root{--c:min(calc(100vw / 760), calc(100vh / 430))}
    .hero{gap:calc(var(--c)*12)}
    .title{font-size:calc(var(--c)*31);line-height:1.32;max-width:26ch}
    .sub{font-size:calc(var(--c)*16);max-width:44ch}
    .sub span{display:inline}
    .cta{font-size:calc(var(--c)*15.5);padding:calc(var(--c)*12) calc(var(--c)*24)}
    .feats{grid-template-columns:repeat(4,max-content);justify-content:center;
      max-width:none;gap:calc(var(--c)*24);margin-top:calc(var(--c)*2)}
    .feats li{font-size:calc(var(--c)*13.5)}
    .rule{height:calc(var(--c)*20);margin:calc(var(--c)*10) auto 0}
  }

  /* --- B2. TABLET CANVAS --- */
  @media (min-width:600px) and (min-height:430px){
    :root{--c:min(calc(100vw / 860), calc(100vh / 1120))}
    .brand svg{width:calc(var(--c)*30)}
    #word{font-size:calc(var(--c)*26)}
    .hero{gap:calc(var(--c)*26)}
    .title{font-size:calc(var(--c)*46);line-height:1.3;max-width:none}
    .title span{display:block}
    .sub{font-size:calc(var(--c)*21);line-height:1.45;max-width:none}
    .sub span{display:block}
    .cta{gap:calc(var(--c)*14);padding:calc(var(--c)*18) calc(var(--c)*34);
         font-size:calc(var(--c)*21)}
    .cta .arrow{width:calc(var(--c)*20);height:calc(var(--c)*14)}
    .feats{grid-template-columns:repeat(2,max-content);justify-content:center;
      gap:calc(var(--c)*22) calc(var(--c)*54);max-width:none;
      margin-top:calc(var(--c)*12)}
    .feats li{gap:calc(var(--c)*12);font-size:calc(var(--c)*16)}
    .feats .chev{width:calc(var(--c)*12);height:calc(var(--c)*21)}
    .rule{height:calc(var(--c)*46);margin:calc(var(--c)*30) auto 0}

    @media (min-aspect-ratio:1/1){
      :root{--c:min(calc(100vw / 1040), calc(100vh / 780))}
      .feats{grid-template-columns:repeat(4,max-content);gap:calc(var(--c)*40)}
    }
  }
}

/* ================= 9. DYNAMIC VIEWPORT OVERRIDE ================= */
@supports (height:100dvh){
  @media (max-width:1199px),(max-height:559px),(max-aspect-ratio:100/95){
    :root{--c:min(calc(100vw / 430), calc(100dvh / 860))}
    .stage{height:100dvh}
    @media (max-width:599px),(max-height:429px){
      :root{--c:min(calc(100vw / 360), calc(100dvh / 770), 1px);--rise:6px}
    }
    @media (max-height:429px) and (min-aspect-ratio:1/1){
      :root{--c:min(calc(100vw / 760), calc(100dvh / 430))}
    }
    @media (min-width:600px) and (min-height:430px){
      :root{--c:min(calc(100vw / 860), calc(100dvh / 1120))}
      @media (min-aspect-ratio:1/1){
        :root{--c:min(calc(100vw / 1040), calc(100dvh / 780))}
      }
    }
  }
}

/* ================= WX QR MODAL（白卡范式：深遮罩+白卡+微信绿） ================= */
.wx-modal{position:fixed;inset:0;z-index:30;display:flex;align-items:center;
  justify-content:center;padding:calc(var(--u)*24)}
.wx-scrim{position:absolute;inset:0;background:rgba(2,6,15,.66);
  -webkit-backdrop-filter:blur(calc(var(--u)*16));backdrop-filter:blur(calc(var(--u)*16))}
.wx-card{position:relative;z-index:1;width:min(340px,86vw);text-align:center;
  padding:calc(var(--u)*30) calc(var(--u)*26) calc(var(--u)*22);
  border-radius:calc(var(--u)*18);background:#ffffff;color:#0f172a;
  box-shadow:0 calc(var(--u)*24) calc(var(--u)*64) rgba(2,6,14,.6)}
.wx-title{margin:0 0 calc(var(--u)*16);font-size:calc(var(--u)*17);
  letter-spacing:calc(var(--u)*1.5);font-variation-settings:'wght' 560;color:#0f172a}
.wx-qr-frame{display:inline-block;padding:calc(var(--u)*10);
  background:#f7f9fc;border:1px solid #eef2f7;border-radius:calc(var(--u)*14);
  margin-bottom:calc(var(--u)*16)}
.wx-qr{display:block;width:min(200px,56vw);height:auto;border-radius:calc(var(--u)*6)}
.wx-idrow{display:flex;align-items:center;justify-content:center;white-space:nowrap;
  gap:calc(var(--u)*10);padding-top:calc(var(--u)*14);
  border-top:1px solid #eef2f7}
.wx-idlabel{font-size:calc(var(--u)*12.5);font-variation-settings:'wght' 446;color:#64748b}
.wx-id{font-size:calc(var(--u)*14.5);font-variation-settings:'wght' 534;color:#0f172a;
  letter-spacing:calc(var(--u)*.4)}
.wx-copy{min-width:calc(var(--u)*68);padding:calc(var(--u)*7) calc(var(--u)*14);
  display:inline-flex;align-items:center;justify-content:center;border:0;cursor:pointer;
  border-radius:999px;background:#07C160;color:#fff;font-size:calc(var(--u)*13);
  font-variation-settings:'wght' 581;white-space:nowrap;
  box-shadow:0 calc(var(--u)*4) calc(var(--u)*12) rgba(7,193,96,.32);
  transition:background .15s ease,transform .15s ease}
.wx-copy:hover{background:#06ad56}
.wx-copy:active{transform:scale(.95)}
.wx-hint{margin:calc(var(--u)*12) 0 0;font-size:calc(var(--u)*12);
  font-variation-settings:'wght' 446;color:#94a3b8}
.wx-close{position:absolute;top:calc(var(--u)*4);right:calc(var(--u)*4);
  width:max(44px,calc(var(--u)*38));height:max(44px,calc(var(--u)*38));display:flex;
  align-items:center;justify-content:center;background:none;border:0;cursor:pointer;
  color:#94a3b8;transition:color .15s ease}
.wx-close:hover{color:#0f172a}
.wx-close svg{width:calc(var(--u)*12);height:calc(var(--u)*12);fill:none;
  stroke:currentColor;stroke-width:1.6;stroke-linecap:round}

@media (prefers-reduced-motion:no-preference){
  .wx-scrim{animation:wx-fade .22s ease backwards}
  .wx-card{animation:wx-pop .3s var(--ent-soft) backwards}
  @keyframes wx-fade{from{opacity:0}}
  @keyframes wx-pop{from{opacity:0;transform:translateY(calc(var(--u)*10)) scale(.96)}}
}

/* ================= 10. REDUCED MOTION ================= */
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
}
</style>
