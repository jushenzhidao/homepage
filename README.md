# oneapis-home — 官网首页

oneapis.cn 官网首页（NEURAL 风格锁定式 Hero：视频背景 + 可变字体排版 + 纯 CSS 入场动画）。

## 技术栈

- Vue 3.4 + TypeScript（`<script setup>`）
- Vite 5
- 零 UI 框架依赖，视觉全部自绘（Sora + Noto Sans SC 可变字体，`font-variation-settings` 逐元素分数字重）

## 快速开始

```bash
npm install
npm run dev      # 开发预览 http://localhost:5173（HMR）
npm run build    # vue-tsc 类型检查 + 产物构建 → dist/
npm run preview  # 本地预览构建产物
```

## 目录结构

```
index.html              入口 HTML（挂载点 / 字体 / viewport-fit=cover）
src/
  main.ts               应用启动
  App.vue               根组件
  views/HomeView.vue    首页（NEURAL 风格 Hero，全部视觉与逻辑在此）
  styles/global.css     基础 reset（深底 / overflow:hidden / 字体栈 / #app 壳透明化）
  data/models.ts        网关真实模型数据（fetch_models.cjs 生成，模型广场区块预留）
neural-hero.html        静态单文件参照版（与 Vue 版视觉一致，双击即开）
fetch_models.cjs        从 new-api 网关拉取 /v1/models 并归类生成 src/data/models.ts
```

## 关键实现说明

- **锁定式构图**：桌面 ≥1200px 走 1536×1024 网格绝对坐标，`--u` 单位随视口等比缩放零回流；以下切流式布局（430×860 基准 + 手机/横屏/平板画布）。
- **入场时间线**：~2.1s 一次性播放（clip-path 揭示 + 位移 + 缩放），播完给 `<html>` 加 `is-entered`，断点切换不重放。
- **可访问性**：`prefers-reduced-motion` 下动画全关、背景视频 JS 暂停在首帧；键盘焦点环齐全；手机端 44px 触达保证。
- **`#app` / `.page` 均 `display:contents`**：让组件内 fixed 层直接参与 body 布局（流式画布 body 是 flex 容器）。

## 注意

- 背景**视频/海报为远程 CDN 资源**（CloudFront，~36MB MP4），首次加载需网络。
- `.gw_auth` 含网关 API key，**已进 .gitignore，严禁提交**；`fetch_models.cjs` 运行时读取它。
- 字体走 Google Fonts CDN；如需内网/离线部署，把变量字体 TTF 本地化后改 `index.html` 的字体引入。
