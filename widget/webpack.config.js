const path = require('path')
const webpack = require('webpack')

<<<<<<< HEAD
const bundleOutputDir = './dist';

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');

// const workboxPlugin = require('workbox-webpack-plugin');
=======
const bundleOutputDir = './dist'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

>>>>>>> 12688e834a70a955df87d072803bc862cfa9dadd

module.exports = {
	mode: 'development',
	context: __dirname,
	entry: {
        main: [
            './src/index.js',
            './src/style.css'
        ]
    },
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'main.js',
	},
	plugins: [
<<<<<<< HEAD
		new webpack.ProgressPlugin(),
		new MiniCssExtractPlugin({ filename: 'main.[chunkhash].css' }),
		// new workboxPlugin.GenerateSW({
		// 	swDest: 'sw.js',
		// 	clientsClaim: true,
		// 	skipWaiting: false
		// })
=======
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin()
>>>>>>> 12688e834a70a955df87d072803bc862cfa9dadd
	],
    devServer: {
        contentBase: bundleOutputDir
    },
	module: {
		rules: [
            {
                test: /\.html$/i, use: 'html-loader'
            },
			{
                test: /.(js|jsx)$/,
                include: [],
				exclude: /node_modules/,
				loader: 'babel-loader'
            },
			{
                test: /\.css$/,
                include: path.resolve(__dirname, './src/style.css'),
				exclude: /node_modules/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					'css-loader'
				]
			}

		]
	},

	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()],

		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	}
}
