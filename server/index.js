require('babel-core/register')
const nodemon = require('nodemon')
const cp = require('child_process')
const chalk = require('chalk')
const config = require('config')
const utils = require('@s/utils')
const randomPort = require('nb-random-port')
const logger = require('@s/middleware/logger')

let child = null

const mon = nodemon({
  stdout: true,
  script: 'server/worker-server.js',
  ignore: ['server/index.js']
})

mon.on('start', async () => {
  logger.env()
  if (!child && !utils.isProd) {
    // 生成一个随机的可用port，给代理API服务使用
    let rport = await randomPort({from: 9500, to: 9900, excluede: config.port})
    utils.writeJs('server/.cache.js', {rport})

    // dev环境下fork一个进程来单独处理client端的代理
    // 这样可以避免因server端的改动而引起的client端的频繁rebuild
    // 从而改善开发体验，提升本地开发效率
    child = cp.fork(`server/worker-client.js`, {
      silent: false
    })
  }
})

/*
mon.on('restart', () => {})
mon.on('exit', () => {})
mon.on('crash', err => {
  console.log(chalk.red.bold(`Process crashed`))
  console.log(chalk.red(err))
})
*/
