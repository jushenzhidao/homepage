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

/* ---- reduced-motion：暂停背景视频（CSS 重置只管动画/过渡，视频要 JS） ---- */
let mm: MediaQueryList | null = null
let mediaSync: (() => void) | null = null

/* ---- 入场时间线退役：最后一次 tween 结束后加 is-entered，防断点切换重放 ---- */
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
      <a class="cta" href="#"><span id="cta">立即开始</span>
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

    <footer class="foot">
      <span id="foot1">全球创新团队的共同选择。</span>
      <a class="contact" href="#" @click.prevent="qrOpen = true"><span id="footc">联系销售 · 微信 Hedaofei0303</span></a>
      <!-- <span id="foot2">2026</span> -->
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
h1,p,ul{margin:0;padding:0}
li{list-style:none}
a{color:inherit;text-decoration:none}
a:focus-visible{outline:2px solid #9fe0ff;outline-offset:3px;border-radius:4px}
/* 组件根壳透明化：与 global.css 的 #app{display:contents} 配套 */
.page{display:contents}

/* ================= 4. BACKGROUND LAYERS ================= */
.art{
  position:fixed;inset:0;width:100%;height:100%;object-fit:cover;
  object-position:50% 50%;z-index:0;user-select:none;
  -webkit-user-drag:none;pointer-events:none;background:#03060c;
}
.veil{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:
    radial-gradient(140% 60% at 50% 40%,
        rgba(var(--veil),.16) 0%, rgba(var(--veil),.057) 50%,
        rgba(var(--veil),0) 100%),
    linear-gradient(180deg, rgba(var(--veil),0) 45%,
        rgba(var(--veil),.10) 100%);
}
.bar,.hero,.foot{position:fixed;z-index:1}

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
  @keyframes en-settle{from{opacity:0;translate:0 calc(var(--rise)*.7);scale:.99}}
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
  html:not(.is-entered) #foot1                 {animation:en-lift  .60s var(--ent-soft) 1.42s backwards}
  html:not(.is-entered) #footc                 {animation:en-lift  .60s var(--ent-soft) 1.45s backwards}
  html:not(.is-entered) #foot2                 {animation:en-lift  .60s var(--ent-soft) 1.48s backwards}
}

/* ================= 7. ARCHITECTURE A — LOCKED (desktop) ================= */
@media (min-width:1200px) and (min-height:560px) and (min-aspect-ratio:100/95){
  .bar,.hero,.foot{left:50%;width:calc(var(--u)*1536);transform:translateX(-50%)}
  .bar{top:0;height:calc(var(--u)*120)}
  .foot{bottom:0;height:calc(var(--u)*140)}
  .hero{top:50%;height:calc(var(--u)*1024);transform:translate(-50%,-50%)}
  .bar > *,.foot > *,.hero > *{position:absolute}
  .foot .contact{position:static}
  .title,.sub,.feats{inset:0;font-weight:inherit}
  .bar span,.foot span,.title span,.sub span,.feats span,.cta span{
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
  #foot1{left:0;right:0;text-align:center;bottom:calc(var(--u)*101.344);
    font-size:calc(var(--u)*16.3);letter-spacing:calc(var(--u)*0.8);transform:translateX(calc(var(--u)*-0.5))}
  #footc{left:0;right:0;text-align:center;bottom:calc(var(--u)*76.344);
    font-size:calc(var(--u)*16.3);letter-spacing:calc(var(--u)*0.8);transform:translateX(calc(var(--u)*-0.5));
    transition:color .15s ease}
  #footc:hover{color:var(--ink)}
  #footc{text-decoration:underline;text-underline-offset:.35em;
    text-decoration-color:rgba(196,214,232,.4)}
  #foot2{left:0;right:0;text-align:center;bottom:calc(var(--u)*55);
    font-size:calc(var(--u)*16.3);letter-spacing:calc(var(--u)*1);transform:translateX(calc(var(--u)*-2))}
}

/* ================= 8. ARCHITECTURE B — FLOW ================= */
@media (max-width:1199px),(max-height:559px),(max-aspect-ratio:100/95){
  :root{--c:min(calc(100vw / 430), calc(100vh / 860))}
  body{
    display:flex;flex-direction:column;height:100vh;
    padding:calc(env(safe-area-inset-top) + calc(var(--c)*24)) calc(var(--c)*22)
            calc(env(safe-area-inset-bottom) + calc(var(--c)*22));
  }
  .bar,.hero,.foot{position:static;width:100%}
  .bar{order:1;position:relative;z-index:5;display:flex;align-items:center}
  .brand{display:flex;align-items:center;gap:calc(var(--c)*8)}
  .brand svg{width:calc(var(--c)*22);height:auto}
  #word{font-size:calc(var(--c)*19);letter-spacing:.06em}

  .hero{order:2;flex:1;display:flex;flex-direction:column;align-items:center;
        justify-content:center;text-align:center;gap:calc(var(--c)*20)}
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
  .foot{order:3;text-align:center;color:var(--foot);
        font-size:calc(var(--c)*13);line-height:1.55}
  .foot span{display:block}
  .foot .contact{display:block;margin-top:calc(var(--c)*32);
    font-size:calc(var(--c)*14)}
  #footc{transition:color .15s ease;text-decoration:underline;
    text-underline-offset:.3em;text-decoration-color:rgba(196,214,232,.4)}
  #footc:hover{color:var(--ink)}

  /* --- B1. PHONE CANVAS --- */
  @media (max-width:599px),(max-height:429px){
    :root{--c:min(calc(100vw / 360), calc(100vh / 770), 1px);--rise:6px}
    body{padding:calc(env(safe-area-inset-top) + calc(var(--c)*28)) calc(var(--c)*26)
               calc(env(safe-area-inset-bottom) + calc(var(--c)*26))}
    .brand svg{width:calc(var(--c)*24)}
    #word{font-size:calc(var(--c)*19)}

    .veil{background:
      radial-gradient(130% 44% at 50% 45%,
          rgba(var(--veil),.50) 0%, rgba(var(--veil),.26) 55%,
          rgba(var(--veil),0) 100%),
      linear-gradient(180deg,
          rgba(var(--veil),.34) 0%, rgba(var(--veil),0) 20%,
          rgba(var(--veil),0) 60%, rgba(var(--veil),.36) 100%)}

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
    .foot{font-size:calc(var(--c)*13.5);line-height:1.65;text-wrap:balance}
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
    .foot{font-size:calc(var(--c)*13)}
  }

  /* --- B2. TABLET CANVAS --- */
  @media (min-width:600px) and (min-height:430px){
    :root{--c:min(calc(100vw / 860), calc(100vh / 1120))}
    body{padding:calc(env(safe-area-inset-top) + calc(var(--c)*40)) calc(var(--c)*44)
               calc(env(safe-area-inset-bottom) + calc(var(--c)*36))}
    .brand svg{width:calc(var(--c)*34)}
    #word{font-size:calc(var(--c)*30)}
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
    .foot{font-size:calc(var(--c)*16)}

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
    body{height:100dvh}
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
.wx-card{position:relative;z-index:1;width:min(320px,86vw);text-align:center;
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
.wx-copy{ color: #fff;
    padding: 5px 10px;margin-left:10px;
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
