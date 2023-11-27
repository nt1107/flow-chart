/* eslint-disable @typescript-eslint/no-var-requires */
// 需要安装依赖:  npm i eslint-define-config
const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  env: {
    browser: true,
    es2021: true,
    node: true,
    // 解决 defineProps and defineEmits generate no-undef warnings
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    './src/dts/.eslintrc-auto-import.json'
  ],
  overrides: [],

  /* 指定如何解析语法。*/
  // https://stackoverflow.com/questions/66597732/eslint-vue-3-parsing-error-expected-eslint
  parser: 'vue-eslint-parser',
  /* 优先级低于parse的语法解析配置 */
  parserOptions: {
    parser: '@typescript-eslint/parser',
    //模块化方案
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // ts (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    // https://stackoverflow.com/questions/66773897/react-using-typescript-dont-use-as-a-type
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off', // 不允许使用后缀运算符的非空断言(!)

    // vue (https://eslint.vuejs.org/rules)
    'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
    '@typescript-eslint/no-this-alias': ['off']
  }
});
