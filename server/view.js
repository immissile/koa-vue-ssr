const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const config = require('config')
const utils = require('@s/utils')

const defaults = {
  template: utils.resolve('client/index.tpl.html'),
  bundle: utils.resolve(`${config.dist}/vue-ssr-server-bundle.json`),
  clientManifest: utils.resolve(`${config.dist}/vue-ssr-client-manifest.json`)
}

class View {
  constructor(app, options = {}) {
    this.template = options.template || fs.readFileSync(defaults.template, 'utf-8')

    if (utils.isProd) {
      const bundle = options.bundle || require(defaults.bundle)
      const clientManifest = options.clientManifest || require(defaults.clientManifest)
      this.renderer = this.createRenderer(bundle, {
        clientManifest
      })
    } else {
      const devServer = utils.resolve('build/setup-dev-server')
      this.ready = require(devServer)(app, (bundle, opts) => {
        this.renderer = this.createRenderer(bundle, opts)
      })
    }
  }

  /**
   * create bundle renderer
   * @param {file} bundle
   * @param {object} options
   */
  createRenderer(bundle, options = {}) {
    return require('vue-server-renderer').createBundleRenderer(bundle, Object.assign({
      template: this.template,
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15,
      }),
      basedir: utils.resolve(config.dist),
      runInNewContext: false
    }, options))
  }

  /**
   * render html
   * @param {object} context
   */
  render(context) {
    return new Promise((resolve, reject) => {
      this.renderer.renderToString(context, (err, html) => {
        if (err) {
          reject(err)
        }
        resolve(html)
      })
    })
  }
}

module.exports = View
