const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",

  //  Dossier racine des tests :
  // roots: ["<rootDir>/tests"],

  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  verbose: true,

  // 🧪 Collecte de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: ["scripts/**/*.js"],
  coverageDirectory: "coverage",
};
