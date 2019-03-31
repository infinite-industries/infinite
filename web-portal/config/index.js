const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),
    assetsSubDirectory: 'public',
    assetsPublicPath: '/',
    proxyTable: {},

    host: 'localhost',
    port: 7779,

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,
    cssSourceMap: true
  },

  build: {
    env: require('./prod.env'),
    assetsRoot: path.resolve(__dirname, '../public'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',

    productionSourceMap: true,
    devtool: '#source-map',

    bundleAnalyzerReport: process.env.npm_config_report
  }
}
