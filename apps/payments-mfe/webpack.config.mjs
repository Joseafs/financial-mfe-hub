import { fileURLToPath } from 'node:url';
import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const { DefinePlugin } = webpack;
const { ModuleFederationPlugin } = webpack.container;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env = {}, argv) => {
  const port = Number(env.port ?? 4203);
  const version = String(env.version ?? process.env.npm_package_version ?? '0.0.0');
  const release = String(env.release ?? 'active');
  const production = argv.mode === 'production';

  return {
    entry: path.resolve(__dirname, 'src/index.ts'),
    devtool: production ? 'source-map' : 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'auto',
      clean: true,
      uniqueName: `financial_mfe_payments_${release}`,
      filename: production ? 'assets/[name].[contenthash:8].js' : '[name].js',
      chunkFilename: production ? 'assets/[name].[contenthash:8].js' : '[name].js',
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
        name: 'payments',
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
        __FMH_APP_NAME__: JSON.stringify('payments-mfe'),
        __FMH_VERSION__: JSON.stringify(version),
        __FMH_ENV__: JSON.stringify(process.env.FMH_ENV ?? 'local'),
      }),
      new HtmlWebpackPlugin({
        templateContent: `<!doctype html><html><body style="background:#020617;color:#fff;font-family:system-ui"><h1>payments-mfe ${release} online</h1><p>Version <strong>${version}</strong> · port ${port}</p><p>Consume <code>remoteEntry.js</code> through the Shell.</p></body></html>`,
      }),
    ],
    devServer: {
      port,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
  };
};
