const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    // ✅ On ignore certains dossiers ou fichiers
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".cache/**",
      ".strapi/**",
      "coverage/**",
      "*.config.js",
      ".tmp/**",
      "src/admin/vite.config.example.ts",
    ],
  },
  {
    // ✅ Fichiers pris en compte
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        Buffer: "readonly",

        // ✅ Ajout des globals Jest pour corriger les erreurs “jest / describe / it / expect is not defined”
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // ✅ Règles de base
      "no-unused-vars": "off",
      "no-undef": "error",

      // ⚠️ Par défaut, ESLint n’autorise pas console.log (seulement warn / error)
      // 👉 Si tu veux éviter les warnings, mets plutôt "off"
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // ✅ Règles TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  {
    // ✅ Règles spécifiques aux fichiers JS purs
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
