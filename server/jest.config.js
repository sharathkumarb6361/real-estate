module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  clearMocks: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    'services/**/*.js',
    'utils/**/*.js',
    '!seed/**'
  ]
};
