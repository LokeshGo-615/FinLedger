module.exports = {
  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  transform: {
  "^.+\\.tsx?$": [
    "ts-jest",
    {
      useESM: true,
    },
  ],
},

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  setupFiles: [
    "<rootDir>/tests/load-test-env.cjs",
  ],

  setupFilesAfterEnv: [
    "<rootDir>/tests/setup.ts",
  ],

  testMatch: [
    "**/tests/**/*.test.ts",
  ],

  clearMocks: true,
  verbose: true,
  testTimeout: 30000,
};