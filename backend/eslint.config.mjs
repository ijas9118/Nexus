import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/**', 'node_modules/**'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-undef': 'error', // Prevents using undeclared variables
      eqeqeq: 'error', // Enforces strict equality (=== and !==)
      curly: 'error', // Enforces consistent brace style for control statements
      quotes: ['error', 'single'], // Enforces single quotes for strings
      semi: ['error', 'always'], // Enforces semicolons at the end of statements

      '@typescript-eslint/explicit-function-return-type': 'off', // Allows implicit return types
      '@typescript-eslint/no-explicit-any': 'warn', // Warns about using `any` type
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' }, // Ignores unused variables starting with `_`
      ],
      '@typescript-eslint/ban-ts-comment': 'warn', // Warns about using `@ts-ignore` comments
      '@typescript-eslint/no-empty-function': 'warn', // Warns about empty functions

      indent: ['error', 2], // Enforce 2-space indentation
      'comma-dangle': ['error', 'always-multiline'], // Enforce trailing commas in multiline objects/arrays
      'object-curly-spacing': ['error', 'always'], // Enforce spacing inside curly braces
      'array-bracket-spacing': ['error', 'never'], // Disallow spacing inside array brackets
      'arrow-parens': ['error', 'always'], // Enforce parentheses around arrow function parameters
    },
  },
  eslintConfigPrettier,
];
