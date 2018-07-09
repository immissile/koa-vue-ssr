require('babel-core/register')
const koaRouter = require('koa-router')
const proxy = require('nb-koa-proxy')
const excludeApi = require('@s/router/exclude-api').default
const worker = require('@s/app').default
const config = require('config')

const router = new koaRouter()

worker(`CLIENT`, app => {
  // proxy api request
  const tables = {
    '/api': {
      target: `http://localhost:${app.DEV_CLIENT_PORT}`,
      changeOrigin: true
    }
  }
  app.use(proxy(tables))

  // excluede api request
  excludeApi(router, require('@s/prepare')(app))

  return router
})
