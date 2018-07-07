require('babel-core/register')
const router = require('@s/router').default
const worker = require('@s/app').default

// 8080
worker(`SERVER`, app => {
  return router
})
