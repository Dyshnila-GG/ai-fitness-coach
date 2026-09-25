// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    // Tests re-require modules after changing process.env.
    files: ['**/__tests__/**'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    ignores: ['dist/*', '.expo/*', 'coverage/*', 'supabase/functions/*', 'expo-env.d.ts'],
  },
]);
