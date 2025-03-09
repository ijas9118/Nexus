import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "@typescript-eslint/explicit-function-return-type": "off", // Allow implicit return types
      "@typescript-eslint/no-explicit-any": "warn", // Warn about using `any`
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" }, // Ignore unused variables starting with `_`
      ],

      // "no-console": "warn", // Warn about `console.log`
      "no-undef": "error", // Prevent using undeclared variables
      eqeqeq: "error", // Enforce strict equality (=== and !==)
      curly: "error", // Enforce consistent brace style for control statements
      quotes: ["error", "single"], // Enforce single quotes
      semi: ["error", "always"], // Enforce semicolons

      indent: ["error", 2], // Enforce 2-space indentation
      "comma-dangle": ["error", "always-multiline"], // Enforce trailing commas in multiline objects/arrays
      "object-curly-spacing": ["error", "always"], // Enforce spacing inside curly braces
      "array-bracket-spacing": ["error", "never"], // Disallow spacing inside array brackets
      "arrow-parens": ["error", "always"], // Enforce parentheses around arrow function parameters
    },
  },
  eslintConfigPrettier,
);
