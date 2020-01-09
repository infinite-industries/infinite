const path = require('path')
const webpack = require('webpack')

const bundleOutputDir = './dist'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const SITE_URL = {
    production: JSON.stringify("https://staging.infinite.industries"),
    staging: JSON.stringify("https://staging.infinite.industries")
}

const environment = process.env.NODE_ENV === 'production' ? 'production' : 'staging'
console.log(environment)


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
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            'SITE_URL': SITE_URL[environment]
        })
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
