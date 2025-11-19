const path = require('path');
module.exports = {
  stories: ['../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-webpack5-compiler-babel',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {},
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config, { configType }) => {
    // Find and update existing CSS rule for CSS modules
    const cssRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test && rule.test.test('.css')
    );

    if (cssRule) {
      // Remove the existing CSS rule
      const index = config.module.rules.indexOf(cssRule);
      config.module.rules.splice(index, 1);
    }

    // Add CSS Modules support with explicit include/exclude
    config.module.rules.push({
      test: /\.module\.css$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[local]--[hash:base64:5]',
              auto: true,
            },
            importLoaders: 1,
          },
        },
      ],
    });

    // Add regular CSS support
    config.module.rules.push({
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: ['style-loader', 'css-loader'],
    });

    return config;
  },
};
