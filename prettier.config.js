/**
 * https://prettier.io/docs/en/options.html
 */
const prettierConfig = {
  arrowParens: "always",
  bracketSpacing: true,
  // endOfLine: "lf", comes from editorconfig
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: "as-needed",
  // printWidth: 200, comes from editorconfig
  proseWrap: "preserve",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  // tabs: true, comes from editorconfig
  trailingComma: "es5",
};

module.exports = prettierConfig;
