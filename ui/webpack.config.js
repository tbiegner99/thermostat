const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/pages/App.js',
  output: {
    filename: '[name].[contenthash].bundle.js',

    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },

  devServer: {
    hot: true,
    port: 8000,
    historyApiFallback: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
    proxy: {
      '/api': process.env.API_TARGET || 'http://localhost:8080',
    },
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff2?|ttf)$/i,
        use: { loader: 'file-loader' },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[path][name]_[local]',
              },
            },
          },
        ],
      },
    ],
  },
};
