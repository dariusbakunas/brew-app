const path = require('path');
const fs = require('fs');
const glob = require('glob');

const rootDir = 'src/client/components';

const getExampleFilename = componentpath => componentpath.replace(/\.tsx$/, '.md');

module.exports = {
  components: () => glob.sync(`${rootDir}/**/*.tsx`).filter((module) => {
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
  propsParser: require('react-docgen-typescript').parse,
  webpackConfig: require('./webpack.config')(null, { mode: 'dev'})[0],
};
