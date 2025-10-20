const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], //  Dossier où sont stockés les tests
  moduleFileExtensions: ["js", "json", "ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["scripts/**/*.js"], //  On mesure la couverture du script d'import
  coverageDirectory: "coverage", //  Dossier de sortie
};
