import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import jest from 'eslint-plugin-jest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { includeIgnoreFile } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default [
  {
    ignores: ['**/dist', '**/webpack.*.js'],
  },
  includeIgnoreFile(gitignorePath),
  ...compat.extends('eslint:recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...jest.environments.globals.globals,
      },

      ecmaVersion: 2022,
      sourceType: 'module',
    },

    rules: {
      'no-unused-vars': 'warn',
    },
  },
  ...compat.extends('plugin:jest/recommended').map((config) => ({
    ...config,
    files: ['**/*.test.js'],
  })),
  {
    files: ['**/*.test.js'],

    plugins: {
      jest,
    },

    rules: {
      'jest/prefer-expect-assertions': 'off',
    },
  },
];
