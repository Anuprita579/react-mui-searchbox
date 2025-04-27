module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)', '**/?(*.)+(spec|test).(js|jsx|ts|tsx)'],
  };
  