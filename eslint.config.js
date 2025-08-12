import pluginImport from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue', '**/*.js', '**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      import: pluginImport,
      vue: pluginVue,
    },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/html-indent': 'off',
      'vue/multi-word-component-names': 0,
      'vue/html-closing-bracket-newline': 'off',
    },
  },
];
