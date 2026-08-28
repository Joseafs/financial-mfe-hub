import { fileURLToPath } from 'node:url';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const { ModuleFederationPlugin } = webpack.container;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => ({
  entry: path.resolve(__dirname, 'src/index.ts'),
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true,
    uniqueName: 'financial_mfe_shell',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'single-spa': { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      templateContent: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Financial MFE Hub — Architecture Validation</title>
    <style>
      :root {
        color-scheme: dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #020617;
        color: #e2e8f0;
      }

      * { box-sizing: border-box; }
      html { min-width: 320px; background: #020617; }
      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 12% 8%, rgba(14, 116, 144, 0.18), transparent 30%),
          radial-gradient(circle at 88% 18%, rgba(124, 58, 237, 0.14), transparent 26%),
          linear-gradient(180deg, #020617 0%, #07101f 42%, #020617 100%);
      }

      a { color: inherit; }
      button, a { -webkit-tap-highlight-color: transparent; }

      .shell-frame { width: min(1440px, calc(100% - 32px)); margin: 0 auto; }

      .shell-topbar {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        background: rgba(2, 6, 23, 0.84);
        backdrop-filter: blur(18px);
      }

      .shell-topbar__inner {
        min-height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }

      .shell-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
      .shell-brand__mark {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(125, 211, 252, 0.5);
        background: linear-gradient(135deg, rgba(14, 116, 144, 0.9), rgba(15, 23, 42, 0.95));
        box-shadow: 0 12px 30px rgba(14, 116, 144, 0.22);
        font-weight: 900;
      }
      .shell-brand strong { display: block; font-size: 14px; color: #f8fafc; }
      .shell-brand span { display: block; margin-top: 2px; font-size: 11px; color: #64748b; }

      .shell-live {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 11px;
        border-radius: 999px;
        border: 1px solid rgba(34, 197, 94, 0.22);
        background: rgba(20, 83, 45, 0.18);
        color: #bbf7d0;
        font-size: 12px;
        white-space: nowrap;
      }
      .shell-live::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: #22c55e;
        box-shadow: 0 0 16px rgba(34, 197, 94, 0.7);
      }

      .shell-hero {
        padding: 64px 0 28px;
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
        gap: 36px;
        align-items: end;
      }

      .shell-eyebrow {
        margin: 0 0 14px;
        color: #67e8f9;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .shell-hero h1 {
        margin: 0;
        max-width: 900px;
        font-size: clamp(40px, 6vw, 82px);
        line-height: 0.95;
        letter-spacing: -0.055em;
        color: #f8fafc;
      }
      .shell-hero h1 span {
        background: linear-gradient(90deg, #67e8f9 0%, #93c5fd 46%, #c4b5fd 100%);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .shell-hero p {
        margin: 22px 0 0;
        max-width: 760px;
        font-size: 16px;
        line-height: 1.7;
        color: #94a3b8;
      }

      .shell-summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .shell-summary__item {
        padding: 18px;
        border: 1px solid rgba(148, 163, 184, 0.14);
        border-radius: 18px;
        background: rgba(15, 23, 42, 0.58);
        box-shadow: inset 0 1px rgba(255,255,255,0.025);
      }
      .shell-summary__item strong { display: block; color: #f8fafc; font-size: 18px; }
      .shell-summary__item span { display: block; margin-top: 5px; color: #64748b; font-size: 12px; }

      .shell-map { padding: 18px 0 26px; }
      .shell-map__header,
      .shell-stage__header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 16px;
        margin-bottom: 14px;
      }
      .shell-map__header h2,
      .shell-stage__header h2 { margin: 0; font-size: 15px; color: #f8fafc; }
      .shell-map__header p,
      .shell-stage__header p { margin: 4px 0 0; color: #64748b; font-size: 12px; }

      .shell-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
      }

      .shell-node {
        position: relative;
        min-height: 136px;
        padding: 18px;
        border-radius: 20px;
        text-decoration: none;
        overflow: hidden;
        border: 1px solid var(--node-border);
        background: linear-gradient(145deg, var(--node-a), var(--node-b));
        box-shadow: 0 20px 60px rgba(2, 6, 23, 0.24);
        transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
      }
      .shell-node::after {
        content: "";
        position: absolute;
        width: 120px;
        height: 120px;
        right: -46px;
        bottom: -54px;
        border-radius: 999px;
        background: var(--node-glow);
        filter: blur(3px);
        opacity: 0.5;
      }
      .shell-node:hover { transform: translateY(-3px); }
      .shell-node[aria-current="page"] {
        transform: translateY(-3px);
        box-shadow: 0 24px 70px var(--node-shadow), 0 0 0 1px var(--node-highlight);
      }
      .shell-node__top { display: flex; justify-content: space-between; gap: 10px; align-items: center; }
      .shell-node__name { font-size: 15px; font-weight: 800; color: #fff; }
      .shell-node__port { font-size: 11px; color: var(--node-soft); }
      .shell-node__role { display: block; margin-top: 34px; color: var(--node-soft); font-size: 12px; }

      .shell-node--dashboard { --node-a:#1d4ed8; --node-b:#0f172a; --node-border:#60a5fa; --node-soft:#dbeafe; --node-glow:#2563eb; --node-shadow:rgba(29,78,216,.28); --node-highlight:#93c5fd; }
      .shell-node--accounts { --node-a:#15803d; --node-b:#052e16; --node-border:#4ade80; --node-soft:#dcfce7; --node-glow:#16a34a; --node-shadow:rgba(21,128,61,.28); --node-highlight:#86efac; }
      .shell-node--payments { --node-a:#7c3aed; --node-b:#2e1065; --node-border:#a78bfa; --node-soft:#ede9fe; --node-glow:#8b5cf6; --node-shadow:rgba(124,58,237,.28); --node-highlight:#c4b5fd; }
      .shell-node--insurance { --node-a:#c2410c; --node-b:#431407; --node-border:#fb923c; --node-soft:#ffedd5; --node-glow:#ea580c; --node-shadow:rgba(194,65,12,.28); --node-highlight:#fdba74; }

      .shell-runtime {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 8px;
        margin: 4px 0 34px;
      }
      .shell-runtime__item {
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(15, 23, 42, 0.42);
        color: #64748b;
        font-size: 11px;
      }
      .shell-runtime__item strong { color: #cbd5e1; font-weight: 700; }

      .shell-stage { padding: 8px 0 72px; }
      .shell-stage__route {
        color: #cbd5e1;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 12px;
      }
      .shell-stage__frame {
        padding: 10px;
        border-radius: 30px;
        border: 1px solid rgba(148, 163, 184, 0.12);
        background: rgba(15, 23, 42, 0.46);
        box-shadow: 0 30px 120px rgba(2, 6, 23, 0.52);
      }
      #mfe-root { min-height: 420px; }

      .shell-runtime-error {
        min-height: 360px;
        border-radius: 22px;
        padding: 32px;
        border: 1px solid rgba(248, 113, 113, 0.45);
        background: linear-gradient(135deg, rgba(127, 29, 29, 0.7), rgba(15, 23, 42, 0.96));
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
      }
      .shell-runtime-error strong { color: #fecaca; font-size: 20px; }
      .shell-runtime-error span { color: #fca5a5; }
      .shell-runtime-error code { color: #cbd5e1; overflow-wrap: anywhere; }
      .shell-runtime-error__actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
      .shell-runtime-error__actions button,
      .shell-runtime-error__actions a {
        appearance: none;
        border: 1px solid rgba(254, 202, 202, 0.35);
        border-radius: 10px;
        padding: 9px 12px;
        background: rgba(15, 23, 42, 0.62);
        color: #fee2e2;
        font: inherit;
        font-size: 12px;
        text-decoration: none;
        cursor: pointer;
      }

      @media (max-width: 980px) {
        .shell-hero { grid-template-columns: 1fr; }
        .shell-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .shell-runtime { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      @media (max-width: 620px) {
        .shell-frame { width: min(100% - 20px, 1440px); }
        .shell-topbar__inner { min-height: 62px; }
        .shell-live { display: none; }
        .shell-hero { padding-top: 42px; }
        .shell-summary, .shell-grid, .shell-runtime { grid-template-columns: 1fr; }
        .shell-stage__header { align-items: start; flex-direction: column; }
      }
    </style>
  </head>
  <body>
    <header class="shell-topbar">
      <div class="shell-frame shell-topbar__inner">
        <div class="shell-brand">
          <div class="shell-brand__mark">F</div>
          <div>
            <strong>Financial MFE Hub</strong>
            <span>Shell · Single-SPA · localhost:4200</span>
          </div>
        </div>
        <div class="shell-live">Architecture runtime online</div>
      </div>
    </header>

    <div class="shell-frame">
      <section class="shell-hero">
        <div>
          <p class="shell-eyebrow">Architecture Validation First</p>
          <h1>Uma SPA. <span>Quatro aplicações independentes.</span></h1>
          <p>
            O Shell mantém a experiência única enquanto cada Micro Frontend possui lifecycle,
            runtime, identidade visual e evolução independente. A LP existe para tornar a arquitetura
            visível antes de qualquer produto financeiro complexo.
          </p>
        </div>

        <div class="shell-summary" aria-label="Resumo da arquitetura">
          <div class="shell-summary__item"><strong>1</strong><span>Shell / SPA</span></div>
          <div class="shell-summary__item"><strong>4</strong><span>Micro Frontends</span></div>
          <div class="shell-summary__item"><strong>1</strong><span>Fastify BFF</span></div>
          <div class="shell-summary__item"><strong>0</strong><span>reloads entre domínios</span></div>
        </div>
      </section>

      <section class="shell-map">
        <div class="shell-map__header">
          <div>
            <h2>Mapa vivo da SPA</h2>
            <p>Clique em um domínio. O Shell permanece; apenas o remote ativo muda.</p>
          </div>
        </div>

        <nav class="shell-grid" aria-label="Micro Frontends">
          <a class="shell-node shell-node--dashboard" data-single-spa-navigation data-mfe-nav="dashboard" href="/dashboard">
            <span class="shell-node__top"><span class="shell-node__name">Dashboard</span><span class="shell-node__port">:4201</span></span>
            <span class="shell-node__role">overview · blue remote</span>
          </a>
          <a class="shell-node shell-node--accounts" data-single-spa-navigation data-mfe-nav="accounts" href="/accounts">
            <span class="shell-node__top"><span class="shell-node__name">Accounts</span><span class="shell-node__port">:4202</span></span>
            <span class="shell-node__role">accounts · green remote</span>
          </a>
          <a class="shell-node shell-node--payments" data-single-spa-navigation data-mfe-nav="payments" href="/payments">
            <span class="shell-node__top"><span class="shell-node__name">Payments</span><span class="shell-node__port">:4203</span></span>
            <span class="shell-node__role">payments · purple remote</span>
          </a>
          <a class="shell-node shell-node--insurance" data-single-spa-navigation data-mfe-nav="insurance" href="/insurance">
            <span class="shell-node__top"><span class="shell-node__name">Insurance</span><span class="shell-node__port">:4204</span></span>
            <span class="shell-node__role">insurance · orange remote</span>
          </a>
        </nav>
      </section>

      <section class="shell-runtime" aria-label="Runtime local">
        <div class="shell-runtime__item"><strong>Shell</strong> :4200</div>
        <div class="shell-runtime__item"><strong>Dashboard</strong> :4201</div>
        <div class="shell-runtime__item"><strong>Accounts</strong> :4202</div>
        <div class="shell-runtime__item"><strong>Payments</strong> :4203</div>
        <div class="shell-runtime__item"><strong>Insurance</strong> :4204</div>
        <div class="shell-runtime__item"><strong>BFF</strong> :4300</div>
      </section>

      <section class="shell-stage">
        <div class="shell-stage__header">
          <div>
            <h2>Remote stage</h2>
            <p>Área controlada pelo Micro Frontend ativo.</p>
          </div>
          <div class="shell-stage__route">route: <span data-current-route>/dashboard</span></div>
        </div>
        <div class="shell-stage__frame">
          <main id="mfe-root" aria-live="polite"></main>
        </div>
      </section>
    </div>
  </body>
</html>`,
    }),
  ],
  devServer: {
    port: 4200,
    historyApiFallback: true,
    hot: true,
    client: { overlay: true },
  },
});