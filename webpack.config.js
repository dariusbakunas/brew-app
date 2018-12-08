const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = (env, argv) => {
  const dev = argv.mode !== 'production';

  const clientPlugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ];

  const serverPlugins = [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
    new CopyWebpackPlugin([
      { from: 'src/server/index.ejs', to: 'index.ejs' },
    ]),
  ];

  const clientConfig = {
    name: 'clientConfig',
    mode: dev ? 'development' : 'production',
    entry: {
      client: './src/client/index.js',
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
        // need to bundle css separately to avoid un-styled server side pages
        {
          test: /\.(css|less)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
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
      extensions: ['.js', '.jsx'],
      alias: {
        '../../theme.config$': path.join(__dirname, 'semantic-theme/theme.config'),
      },
    },
    plugins: clientPlugins,
  };

  const serverConfig = {
    name: 'serverConfig',
    mode: dev ? 'development' : 'production',
    devtool: 'inline-source-map',
    entry: {
      server: './src/server/bin/www.js',
    },
    externals: [nodeExternals()],
    target: 'node',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-react'],
            plugins: [
              [
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true,
                },
              ],
              '@babel/plugin-proposal-export-default-from',
            ],
          },
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
      extensions: ['.js', '.jsx'],
    },
    plugins: serverPlugins,
  };

  return [
    clientConfig,
    serverConfig,
  ];
};
