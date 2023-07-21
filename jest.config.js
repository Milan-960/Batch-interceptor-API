module.exports = {
  preset: "ts-jest",

  testEnvironment: "jsdom",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  transformIgnorePatterns: ["node_modules/(?!(jest-)?react)"],
};
