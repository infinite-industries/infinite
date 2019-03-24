const path = require('path')

const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    main: './src/main.js',
    light_main: './src/light_main.js'
  },
  output: {
    path: path.join(config.build.assetsRoot, 'js'),
    filename: '[name].js',
    publicPath: 'public'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // this results in a slightly larger bundle,
      // but it's consistent with what Vue CLI does
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test')
        ]
      }
    ]
  }
}
