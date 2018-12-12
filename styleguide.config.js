const path = require('path');
const fs = require('fs');
const glob = require('glob');

const rootDir = 'src/client/components';

const getExampleFilename = componentpath => componentpath.replace(/\.jsx?$/, '.md');

module.exports = {
  components: () => glob.sync(`${rootDir}/**/*.jsx`).filter((module) => {
    const mdFile = getExampleFilename(module);
    try {
      const mdFileWithSameNameExists = fs.statSync(mdFile);
      return mdFileWithSameNameExists && mdFileWithSameNameExists.isFile();
    } catch (err) {
      return !(err && err.code === 'ENOENT');
    }
  }),
  skipComponentsWithoutExample: true,
  require: [
    'uikit/dist/js/uikit.min',
    path.join(__dirname, 'src/client/styles/main.scss'),
    path.join(__dirname, 'src/client/styles/styleguidist.scss'),
  ],
  webpackConfig: {
    module: {
      rules: [
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader!sass-loader?modules',
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loader: 'style-loader!css-loader!postcss-loader!sass-loader',
        },
      ],
    },
  },
};
