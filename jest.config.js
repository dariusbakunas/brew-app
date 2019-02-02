module.exports = {
  roots: [
    '<rootDir>/src',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  setupFiles: [
    '<rootDir>/tests/setupTests.ts',
  ],
  testMatch: null,
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
