import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/artifacts/",
      "**/dist/",
      "**/lib/",
      "**/logo.ai",
      "**/logo.xd",
    ],
  },
  ...compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        browser: false,
      },

      parser: tsParser,
      ecmaVersion: 6,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    files: ["**/*.js", "**/*.ts"],

    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },

    rules: {
      "arrow-body-style": [2, "as-needed"],
      "class-methods-use-this": 0,
      "no-console": 1,

      "no-param-reassign": [
        "error",
        {
          props: false,
        },
      ],

      "no-trailing-spaces": 2,

      "no-use-before-define": [
        2,
        {
          functions: false,
        },
      ],

      "object-curly-newline": [
        2,
        {
          multiline: true,
          consistent: true,
        },
      ],

      "object-property-newline": [
        2,
        {
          allowAllPropertiesOnSameLine: true,
        },
      ],

      "prettier/prettier": 2,
    },
  },
];
