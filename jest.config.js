module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  setupFiles: [
    '<rootDir>/tests/setupTests.ts',
  ],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
};
