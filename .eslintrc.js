module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  globals: {
    browser: false,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "arrow-body-style": [2, "as-needed"],
    "class-methods-use-this": 0,
    "no-console": 1,
    "no-param-reassign": ["error", { props: false }],
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
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
      },
    },
  },
};
