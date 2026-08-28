import { fileURLToPath } from 'node:url';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const { ModuleFederationPlugin } = webpack.container;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => ({
  entry: path.resolve(__dirname, 'src/root-config.ts'),
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
        test: /\\.tsx?$/,
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
      remotes: {
        dashboard: 'dashboard@http://localhost:4201/remoteEntry.js',
        accounts: 'accounts@http://localhost:4202/remoteEntry.js',
        payments: 'payments@http://localhost:4203/remoteEntry.js',
        insurance: 'insurance@http://localhost:4204/remoteEntry.js',
      },
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
    <title>Financial MFE Hub — Architecture Smoke Test</title>
    <style>
      :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      * { box-sizing: border-box; }
      body { margin: 0; background: #020617; color: #e2e8f0; }
      header { padding: 18px 24px; border-bottom: 1px solid #1e293b; background: #0f172a; }
      header strong { color: #7dd3fc; }
      nav { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
      nav a { color: #e2e8f0; text-decoration: none; padding: 8px 12px; border: 1px solid #334155; border-radius: 8px; }
      nav a:hover { border-color: #38bdf8; }
      main { padding: 24px; min-height: calc(100vh - 110px); }
    </style>
  </head>
  <body>
    <header>
      <strong>Financial MFE Hub</strong> · Architecture Validation
      <nav>
        <a href="/dashboard">Dashboard</a>
        <a href="/accounts">Accounts</a>
        <a href="/payments">Payments</a>
        <a href="/insurance">Insurance</a>
      </nav>
    </header>
    <main id="mfe-root"></main>
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
