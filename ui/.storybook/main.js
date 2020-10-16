const path = require('path');
module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-knobs'],
  webpackFinal: async (config, { configType }) => {
    config.module.rules = config.module.rules.filter((f) => f.test.toString() !== '/\\.css$/');

    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            modules: true,
          },
        },
      ],
    });

    // Return the altered config
    return config;
  },
};
