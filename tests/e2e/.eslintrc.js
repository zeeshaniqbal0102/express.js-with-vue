module.exports = {
  plugins: [
    'cypress',
    'chai-friendly',
  ],
  env: {
    mocha: true,
    'cypress/globals': true,
  },
  rules: {
    strict: 'off',
  },
  "settings": {
    "import/resolver": "webpack"
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    'plugin:cypress/recommended', 'plugin:chai-friendly/recommended'
  ],
  rules: {
    'cypress/no-unnecessary-waiting': 0,
    'no-restricted-properties': 0,
    "import/no-extraneous-dependencies": 0
  },
}
