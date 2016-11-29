var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('/sampleDist'),
    publicPath: '/',
    filename:'[name].js',
    chunkFileName:'[id].chunk.js'
  },

  devServer: {
    historyApiFallback: true,
    stats: 'minimal',
    port: 8080,
    host: '0.0.0.0'
  }
});