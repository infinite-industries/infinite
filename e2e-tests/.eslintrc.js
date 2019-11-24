module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:cypress/recommended'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'camelcase': 'off'
  }
}
