const path = require('path')
    , webpack = require('webpack');

module.exports = {
  entry: {
    btmIcon: './src/btm-embed-icon.js',
    btmPage: './src/btm-article-page.js',
    btmFacebook: './src/btm-facebook.js'
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name].bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
  ]
}
