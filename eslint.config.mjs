import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sonarjs from 'eslint-plugin-sonarjs';
// @ts-ignore no types for some reason
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  // @ts-ignore doesn't like this
  eslintPluginPrettierRecommended,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        // @ts-ignore incorrectly things node can't handle this
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      eqeqeq: 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      '@typescript-eslint/no-shadow': 'error',
      'no-useless-return': 'error',
      'no-useless-rename': 'error',
      'object-shorthand': 'error',
      'one-var-declaration-per-line': 'error',
      'prefer-object-spread': 'error',
      'no-unreachable-loop': 'error',
      'no-template-curly-in-string': 'error',
      'default-case-last': 'error',
      'no-array-constructor': 'error',
      'no-else-return': 'error',
      'no-negated-condition': 'error',
      'array-callback-return': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      curly: 'error',
      'no-console': 'error',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'prefer-template': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
      'unused-imports/no-unused-imports': 'error',
    },
  },
);
