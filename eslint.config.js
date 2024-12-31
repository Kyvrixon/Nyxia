import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default [
	{
		files: ["**/*.js"],
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
		},
		rules: {
			quotes: ["error", "double"],
			"no-unused-vars": [
				"error",
				{
					args: "after-used",
					ignoreRestSiblings: true,
					caughtErrors: "all",
				},
			],
			"unused-imports/no-unused-imports": "error",
			semi: ["error", "always"],
			eqeqeq: ["error", "always"],
			curly: ["error", "all"],
			"no-var": "error",
			"no-undef": "error",
			"no-empty-function": "error",
			"prefer-const": "error",
			indent: ["warn", "tab"],
			// "no-console": "warn", remember to comment this out later
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
		},
	},
];
