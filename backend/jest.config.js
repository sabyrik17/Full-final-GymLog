export default {
  testEnvironment: 'node',
  maxWorkers: 1,
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)',
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
  ],
};
