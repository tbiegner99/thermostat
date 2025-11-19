const path = require('path');
const rspack = require('@rspack/core');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    entry: './src/pages/App.tsx',
    output: {
      filename: '[name].[contenthash].bundle.js',
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      clean: true,
    },
    devServer: {
      hot: !isProduction,
      port: 8000,
      historyApiFallback: true,
      client: {
        overlay: {
          warnings: false,
          errors: true,
        },
      },
      proxy: [
        {
          context: ['/api'],
          target: process.env.API_TARGET || 'http://heating.home',
        },
      ],
    },
    plugins: [
      new rspack.HtmlRspackPlugin({
        template: './index.html',
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.(jsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                  jsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
          type: 'javascript/auto',
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|woff2?|ttf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: '[path][name]__[local]',
                },
              },
            },
          ],
          type: 'javascript/auto',
        },
      ],
    },
    experiments: {
      css: true,
    },
  };
};
