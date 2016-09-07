'use strict'

var path = require('path')
var webpack = require('webpack')
var postcss = require('postcss')
var postcssCalc = require('postcss-calc')
var postcssImport = require('postcss-import')
var postcssNested = require('postcss-nested')
var postcssAutoprefixer = require('autoprefixer')
var isHot = process.argv.indexOf('--hot') !== -1

module.exports = {
	                    context: __dirname,
  entry: {
    app: 'src/App.jsx'
  },
  output: {
    path: 'build',
    publicPath: !isHot ? '/build/' : 'http://localhost:8080/build/',
    filename: '[name].bundle.js'
  },
  resolve: {
    root: path.resolve(__dirname),
		                                        extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: [
      'node_modules'
    ]
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]__[local]__[hash:base64:5]!postcss'
      },
      {
        test: /\.html$/,
        loader: 'dom!html'
      },
			                                                            {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/
      }
    ]
  },
  postcss: function (webpack) {
    return [
      postcssImport({addDependencyTo: webpack}),
      postcssNested,
      postcssCalc,
      postcssAutoprefixer
    ]
  }
}
