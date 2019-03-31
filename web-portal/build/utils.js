const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports.cssLoaders = function(options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  function generateLoaders() {
    const loaders = [cssLoader]
    if (options.usePostCSS) loaders.push(postcssLoader)
    // this is standard Vue-CLI setup, but we're never setting extract to true
    // We were using <style> injection in production with browserify, and though it
    // would be nice to break it out into a stylesheet it can wait for the next phase
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders()
  }
}
