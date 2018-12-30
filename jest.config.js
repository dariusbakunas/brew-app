module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  setupFiles: [
    '<rootDir>/tests/setupTests.js',
  ],
};
