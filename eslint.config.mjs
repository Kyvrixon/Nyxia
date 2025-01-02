import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginImport from "eslint-plugin-import";
import tseslint from "@typescript-eslint/eslint-plugin";

export default {
  files: ["**/*.ts", "**/*.js"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    "unused-imports": unusedImports,
    prettier: eslintPluginPrettier,
    import: eslintPluginImport,
    "@typescript-eslint": tseslint,
  },
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["#", "./src"],
        ],
        extensions: [".ts"],
      },
    },
  },
  rules: {
    quotes: ["error", "double"],
    indent: ["warn", 4],
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
    "unused-imports/no-unused-imports": "error",
    "no-var": "error",
    "no-undef": "error",
    "no-empty-function": "error",
    "prefer-const": "error",
    "import/no-unresolved": [
      "error",
      {
        ignore: ["^node:", "^#"],
      },
    ],
    // "no-console": "warn", remember to comment this out later
    "no-unused-vars": [
      "error",
      {
        args: "after-used",
        ignoreRestSiblings: true,
        caughtErrors: "all",
      },
    ],
    "prettier/prettier": [
      "error",
      {
        semi: true,
        singleQuote: false,
        tabWidth: 4,
        useTabs: true,
        trailingComma: "es5",
        printWidth: 80,
        arrowParens: "always",
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignores: ['.git', "./dist"],
};
