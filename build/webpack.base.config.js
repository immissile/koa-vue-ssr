const path = require('path')
const webpack = require('webpack')
const utils = require('./utils')
const config = require('./config')
const vueLoaderConfig = require('./vue-loader.config')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')

const resolve = dir => path.join(__dirname, '..', dir || '')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    app: './client/client.entry.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProd
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.jsx', '.scss', '.less', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('client')
    },
    modules: [resolve('client'), resolve('node_modules')]
  },
  module: {
    // noParse: /es6-promise\.js$/, // avoid webpack shimming process
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('client'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('client'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: false
  },
  plugins: isProd
  ? [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:8].css')
    }),
    // minify css after extract
    new OptimizeCSSPlugin(),
    // minify JS
    new webpack.optimize.UglifyJsPlugin({
      workers: require('os').cpus().length,
      mangle: true,
      compress: {
        warnings: false,
        drop_console: true
      },
      sourceMap: true
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // Scope Hositing
    new webpack.optimize.ModuleConcatenationPlugin(),
  ]
  : [
    new ProgressBarPlugin({
      format: chalk.cyan('Compileing client') + ' [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)'
    })
  ]
}
