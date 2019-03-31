/**
 * Build script (for dev)
 */

const webpack = require('webpack')
const webpackConfig = require('./webpack.dev.conf')

process.env.NODE_ENV = 'development'

webpack(webpackConfig, function (err, stats) {
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')
  if (stats.hasErrors()) {
    console.error('build errors')
    process.exit(1)
  }
})
