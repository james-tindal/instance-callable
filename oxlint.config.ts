import type { OxlintConfig } from 'vite-plus/lint'

import perfectionist from 'eslint-plugin-perfectionist'

export default {
  env: { builtin: true },
  jsPlugins: [
    { name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' },
    '@stylistic/eslint-plugin',
    'eslint-plugin-perfectionist',
  ],
  options: { typeAware: true, typeCheck: true },
  overrides: [{
    files: ['**/*.ts'],
    plugins: ['typescript'],
    rules: {
      ...perfectionist.configs['recommended-natural'].rules,
      '@stylistic/array-bracket-spacing': ['error', 'never', { objectsInArrays: false }],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/arrow-spacing': ['error', {
        after: true,
        before: true,
      }],
      '@stylistic/block-spacing': 'error',
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/comma-spacing': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/generator-star-spacing': ['error', 'after'],
      '@stylistic/object-curly-spacing': ['error', 'always', {
        emptyObjects: 'never',
        objectsInObjects: false,
      }],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never', { beforeStatementContinuationChars: 'never' }],
      '@stylistic/semi-style': ['error', 'first'],
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-in-parens': ['error', 'never'],
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'perfectionist/sort-imports': 'error',
      'prefer-const': 'error',
    },
  }],
  plugins: [],
  rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
} satisfies OxlintConfig
