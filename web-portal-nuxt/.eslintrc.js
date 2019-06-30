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
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "camelcase": "off",
    'vue/script-indent': ['error', 2, {
      baseIndent: 1
    }]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: { indent: 'off' }
    }
  ],
}
