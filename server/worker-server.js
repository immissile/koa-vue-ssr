require('babel-core/register')
const worker = require('@s/app').default

worker(`SERVER`, app => {
  // return routers
  return require('@s/router').default
})
