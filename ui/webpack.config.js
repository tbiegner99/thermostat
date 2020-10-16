const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  watch: true,
  entry: './src/pages/App.js',
  output: {
    filename: '[name].bundle.js',

    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },

  devServer: {
    hot: true,
    port: 8000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  plugins: [new HtmlWebpackPlugin()],
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
          'style-loader',
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
