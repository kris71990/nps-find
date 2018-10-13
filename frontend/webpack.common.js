'use strict';

require('dotenv').config();

const { DefinePlugin } = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

const webpackConfig = module.exports = {};

webpackConfig.entry = `${__dirname}/src/main.js`;

webpackConfig.output = {
  filename: '[name].[hash].js',
  path: `${__dirname}/build`,
  publicPath: process.env.CDN_URL,
};

webpackConfig.plugins = [
  new HtmlWebpackPlugin({
    title: 'Discover National Parks',
    filename: 'index.html',
    template: 'index.html',
    inject: true,
  }),
  new MiniCssPlugin({
    filename: '[name].[hash].css',
  }),
  new DefinePlugin({
    API_URL: JSON.stringify(process.env.API_URL),
    GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
  }),
  new VueLoaderPlugin(),
];

webpackConfig.module = {};

webpackConfig.module.rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: [
      'file-loader',
    ],
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  },
  {
    test: /\.vue$/,
    loader: 'vue-loader',
  },
  {
    test: /\.css$/,
    use: [
      process.env.NODE_ENV !== 'production'
        ? 'vue-style-loader'
        : MiniCssPlugin.loader,
      'css-loader',
    ],
  },
];
