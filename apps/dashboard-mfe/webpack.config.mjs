import { fileURLToPath } from 'node:url';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const { DefinePlugin } = webpack;
const { ModuleFederationPlugin } = webpack.container;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (_env, argv) => ({
  entry: path.resolve(__dirname, 'src/index.ts'),
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'auto',
    clean: true,
    uniqueName: 'financial_mfe_dashboard',
  },
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: { './lifecycles': './src/lifecycles.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: false },
        'react-dom': { singleton: true, requiredVersion: false },
        'single-spa': { singleton: true, requiredVersion: false },
        'single-spa-react': { singleton: true, requiredVersion: false },
      },
    }),
    new DefinePlugin({
      __FMH_APP_NAME__: JSON.stringify('dashboard-mfe'),
      __FMH_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
      __FMH_ENV__: JSON.stringify(process.env.FMH_ENV ?? 'local'),
    }),
    new HtmlWebpackPlugin({
      templateContent: '<!doctype html><html><body style="background:#020617;color:#fff;font-family:system-ui"><h1>dashboard-mfe remote online</h1><p>Consume <code>remoteEntry.js</code> through the Shell.</p></body></html>',
    }),
  ],
  devServer: {
    port: 4201,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
});
