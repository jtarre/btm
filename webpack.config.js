const path = require('path')
	, webpack = require('webpack')
	, LiveReloadPlugin = require('webpack-livereload-plugin')
	, ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: ['./js/btm.js', './stylesheets/index.scss'],
	output: {
		path: path.resolve(__dirname, 'src'),
		filename: 'btm.bundle.js'
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel-loader',
			options: {
				presets: ['es2015', 'stage-2', 'stage-0']
			}
		},
		{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
		},
		{
			test: /\.svg/,
			use: {
				loader: 'svg-url-loader'
			}
		}
		]
	},
	plugins: [
		new LiveReloadPlugin({ appendScriptTag: true }),
		new ExtractTextPlugin({
			filename: 'btm.css',
			allChunks: true
		}),
		// new webpack.optimize.UglifyJsPlugin(),
	]
}
