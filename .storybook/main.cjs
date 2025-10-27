module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  webpackFinal: async (config) => {
    const path = require('path');

    // Add path alias support
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Add TypeScript and JSX loader
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
      ],
    });

    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

    return config;
  },
};
