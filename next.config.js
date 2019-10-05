const { parsed: localEnv } = require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack');

const CLIENT_ENV_WHITELIST = [];

const env = CLIENT_ENV_WHITELIST.reduce((acc, key) => {
  const val = localEnv[key];
  if (val) {
    acc[key] = val;
  }

  return acc;
}, {});

module.exports = {
  webpack: config => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    config.plugins.push(new webpack.EnvironmentPlugin(env));

    return config;
  },
};