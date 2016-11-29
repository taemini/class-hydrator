var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'sample': './sampleSrc/script.ts'
  },

  resolve: {
    extensions: ['', '.js', '.ts']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'sampleSrc/index.html'
    })
  ]
};