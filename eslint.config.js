import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    files: ["**/*.js"], // Matches all JavaScript files
    languageOptions: {
      ecmaVersion: 2021, // Enables ECMAScript 2021 features
      sourceType: "module", // Allows import/export syntax
      globals: {
        ...globals.node, // Enables Node.js global variables
      },
    },
    plugins: {
      "unused-imports": unusedImports, // Correctly import the plugin
    },
    rules: {
      "quotes": ["error", "double"], // Enforce double quotes for strings
      "no-unused-vars": ["error", { 
        args: "after-used", 
        ignoreRestSiblings: true,
        caughtErrors: "all", // Flag unused caught variables in try-catch blocks
      }],
      "unused-imports/no-unused-imports": "error", // Error on unused imports
      "semi": ["error", "always"], // Enforce semicolons
      "eqeqeq": ["error", "always"], // Enforce strict equality (===)
      "curly": ["error", "all"], // Enforce curly braces for all control statements
      "no-var": "error", // Disallow var (use let/const instead)
      "no-undef": "error", // Disallow undefined variables
      "no-empty-function": "error", // Disallow empty functions
     // "no-console": "warn", // remove these in production. Use Logger() class instead
      "prefer-const": "error",
    },
  },
];
