module.exports = {
    parser: '@babel/eslint-parser',
    extends: ['plugin:react/recommended'],
    plugins: ['react'],
    rules: {
      'react/prop-types': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  };
  