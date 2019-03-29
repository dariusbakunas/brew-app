const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = (env, argv) => {
  const dev = argv.mode !== 'production';

  const clientPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  const serverPlugins = [
    new CopyWebpackPlugin([
      { from: 'src/server/index.ejs', to: 'index.ejs' },
      { from: 'src/client/public/images', to: 'images' },
      { from: 'src/manifest.json', to: 'manifest.json' },
    ]),
    new CheckerPlugin(),
  ];

  if (dev) {
    serverPlugins.push(new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }));
  }

  const clientConfig = {
    name: 'clientConfig',
    mode: dev ? 'development' : 'production',
    entry: {
      client: './src/client/index.tsx',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            useBabel: true,
          }
        },
        // need to bundle css separately to avoid un-styled server side pages
        {
          test: /\.(css|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader',
        },
        {
          test: /\.otf(\?.*)?$/,
          use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf',
        },
        {
          test: require.resolve('uikit'),
          loader: 'expose-loader?UIkit',
        },
      ],
    },
    stats: {
      colors: true,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: clientPlugins,
  };

  const serverConfig = {
    name: 'serverConfig',
    mode: dev ? 'development' : 'production',
    devtool: 'inline-source-map',
    entry: {
      server: './src/server/bin/www.ts',
    },
    externals: [
      nodeExternals(),
    ],
    target: 'node',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          options: {
            useBabel: true,
          }
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
      ],
    },
    stats: {
      colors: true,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    node: {
      __dirname: false,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: serverPlugins,
  };

  return [
    clientConfig,
    serverConfig,
  ];
};
