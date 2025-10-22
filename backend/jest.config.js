const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",

  //  Dossier racine des tests :
  // roots: ["<rootDir>/tests"],

  testPathIgnorePatterns: [
    "/node_modules/",
    "/.tmp/", // Fichiers temporaires de Strapi
    "/.cache/", // Cache de Strapi
    "/dist/" // Fichiers de build
  ],

  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  verbose: true,

  // 🧪 Collecte de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}", // Tous les fichiers .ts et .js dans src
    "!src/**/*.test.{ts,js}",
    "!src/admin/**", // Exclut l'interface d'administration
    // Exclut les configurations et types générés qui ne sont pas de la logique métier
    "!src/index.ts",
    "!src/register.ts",
    "!src/bootstrap.ts",
    "!src/config/**"
  ],
  coverageDirectory: "coverage",
};
