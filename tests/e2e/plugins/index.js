const fs = require('fs-extra')
const path = require('path')
const webpack = require('@cypress/webpack-preprocessor')

function getConfigurationByFile(file) {
  const pathToConfigFile = `e2e/config/${file}.json`;
  return fs.readJson(path.join(__dirname, '../../', pathToConfigFile))
}

module.exports = (on, config) => {
  const environment = config.env.configFile;
  const configForEnvironment = getConfigurationByFile(environment);

  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    // eslint-disable-next-line global-require
    webpackOptions: require('../../../webpack.config'),
    watchOptions: {
      resolve: {
        extensions: ['.ts', '.js'],
        // add the alias object
        alias: {
          '@Labels/*': path.resolve(__dirname, 'tests/e2e/dataLabel/*'),
        },
      },
    },
  }

  on('file:preprocessor', webpack(options))

  return (configForEnvironment) || config;
}
