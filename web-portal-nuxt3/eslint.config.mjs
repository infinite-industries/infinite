// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import jest from 'eslint-plugin-jest';

export default withNuxt({
  rules: {
    "no-console": "off",
    "camelcase": "off",
    // TODO: re-enable as many of these as possible after the Nuxt refactor
    // leave vue/script-indent along, though -- that one's set up like we want it
    'array-bracket-spacing': 'off',
    'no-prototype-builtins': 'off',
    'quote-props': 'off',
    'import/order': 'off',
    'space-before-function-paren': 'off',
    'curly': ['error', 'multi-line'],
    'object-shorthand': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/attributes-order': 'off',
    'vue/html-self-closing': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/order-in-components': 'off',
    'vue/prop-name-casing': 'off',
    'vue/require-prop-types': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/script-indent': ['error', 2, {
      baseIndent: 1
    }],
    "no-unused-vars": ["error", { caughtErrors: "none" }],
    "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
  },
  languageOptions: {
    globals: {
      ...jest.environments.globals.globals,
      vi: 'readonly'
    },
  },

  plugins: {
    jest: jest
  }
})
