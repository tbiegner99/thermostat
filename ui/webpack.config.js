const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/pages/App.tsx',
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
    proxy: [
      {
        context: ['/api'],
        target: process.env.API_TARGET || 'http://heating.home',
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
  resolve: {
    symlinks: false,
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
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
      },
    ],
  },
};
