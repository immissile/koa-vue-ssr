import path from 'path'
import Koa from 'koa'
import favicon from 'koa-favicon'
import compression from 'koa-compress'
import koaLogger from 'koa-logger'
import koaStatic from 'koa-static'
import bluebird from 'bluebird'
import chalk from 'chalk'
import config from 'config'
import isEqual from 'lodash/isEqual'
import utils from '@s/utils'
import apiResult from '@s/utils/res'
import logger from '@s/middleware/logger'
import {notFound} from '@s/middleware/error'
// const logger = require('@s/middleware/logger')

global.Promise = bluebird
global.apiResult = apiResult

const HOST = process.env.HOST || '127.0.0.1'

const app = new Koa()

let RPORT = null
try {RPORT = require('@s/.cache').rport} catch (e) {}

export default async (context, callback) => {
  let PORT = process.env.PORT || config.port
  if (!utils.isProd) {
    if (context === 'CLIENT') {
      app.DEV_CLIENT_PORT = RPORT
    }
    if (context === 'SERVER') {
      PORT = RPORT
    }
  }

  logger.listening(context, HOST, PORT)

  // cache static
  const serve = (filepath, cache) => {
    return koaStatic(utils.resolve(filepath), {
      maxage: cache && utils.isProd ? 60 * 60 * 24 * 30 : 0
    })
  }

  app.use(koaLogger())
  app.use(compression({
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  }))

  app.use(favicon('./public/favicon.ico'))
  app.use(serve('public', true))
  app.use(serve('dist', true))

  let router = callback(app)
  if (utils.isProd) {
    // excluede api request
    require('@s/router/exclude-api').default(
      router,
      require('@s/prepare')(app)
    )
  }
  app.use(router.routes())
  app.use(router.allowedMethods())

  // error
  app.use(notFound)

  app.listen(PORT, HOST)
}
