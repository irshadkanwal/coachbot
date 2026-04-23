module.exports = {
  singleQuote: true,
  semi: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-sort-json", "prettier-plugin-tailwindcss"],
  tabWidth: 2,
  trailingComma: 'es5',
  jsxBracketSameLine: false,
  arrowParens: 'always',
  printWidth: 120,
  bracketSpacing: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "^[./]"
  ],
}

