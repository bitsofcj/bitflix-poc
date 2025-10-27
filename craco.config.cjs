const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Fix @babel/runtime resolution to use top-level node_modules
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
    },
    configure: (webpackConfig) => {
      // Disable Fast Refresh which can cause issues with nested directories
      const fastRefreshPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === 'ReactRefreshPlugin'
      );
      if (fastRefreshPlugin) {
        fastRefreshPlugin.options = {
          ...fastRefreshPlugin.options,
          overlay: false,
        };
      }

      // Fix module resolution for @babel/runtime
      // Ensure webpack looks in the top-level node_modules for dependencies
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, 'node_modules'),
        ...(webpackConfig.resolve.modules || []),
      ];

      return webpackConfig;
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  },
};
