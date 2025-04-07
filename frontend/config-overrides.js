const webpack = require('webpack');

module.exports = function override(config, env) {
  // Remove deprecated middleware options
  if (config.devServer) {
    delete config.devServer.onBeforeSetupMiddleware;
    delete config.devServer.onAfterSetupMiddleware;

    // Add setupMiddlewares if needed
    config.devServer.setupMiddlewares = (middlewares, devServer) => {
      // Custom middleware setup if required
      return middlewares;
    };
  }

  return config;
};