const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

const webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': process.env.NODE_ENV === 'testing'
        ? require('../config/test.env')
        : require('../config/prod.env')
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    })
  ]
})

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
