export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];