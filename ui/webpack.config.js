const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/pages/App.js',
  output: {
    filename: '[name].bundle.js',

    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJsPlugin({}), new OptimizeCssAssetsPlugin({})],
  },
  devServer: {
    hot: true,
    port: 8000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  plugins: [new HtmlWebpackPlugin(), new MiniCssExtractPlugin()],
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff2?|ttf)$/i,
        use: 'file-loader',
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
