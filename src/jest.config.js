module.exports = {
  coverageProvider: 'babel',
  collectCoverage: true,
  collectCoverageFrom: [
    'server/**/*.{js,jsx,ts,tsx}', '!server/config/*.js',
    'infra/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    'indexer/**/*.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'json-summary'],
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ["./jestSetup.ts"],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],
  transform: {
    '^.+\\.[t|j]s?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  }
};