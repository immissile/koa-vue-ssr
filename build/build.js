const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')
const config = require('config')
const wpConfigClient = require('./webpack.client.config')
const wpConfigServer = require('./webpack.server.config')
const formatStats = require('./formatStats')

process.env.NODE_ENV = 'production'

const runner = text => {
  return ora({text: text, spinner: 'dots'})
}

console.clear()
const buildServer = () => {
  let spinner = runner(`Building production for server...`)
  spinner.start()
  return new Promise((resolve, reject) => {
    webpack(wpConfigServer, (err, stats) => {
      spinner.stop()
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        return reject(`Build failed with errors.`)
      }

      console.log(chalk.green.bold(`For Server:`), `\n`)
      console.log(formatStats(stats, config.dist, false))
      console.log()
      resolve()
    })
  })
}

const buildClient = () => {
  let spinner = runner(`Building production for client...`)
  spinner.start()
  return new Promise((resolve, reject) => {
    webpack(wpConfigClient, async (err, stats) => {
      spinner.stop()
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        return reject(`Build failed with errors.`)
      }

      console.log()
      console.log(chalk.green.bold(`For Client:`), `\n`)
      console.log(formatStats(stats, config.dist))
      console.log()
      console.log()
      await buildServer()
      console.log(
        chalk.bgGreen.black(` DONE `),
        `Build complete. The ${chalk.cyan(config.dist)} directory is ready to be deployed.`
      )
      console.log()
      console.log()
      resolve()
    })
  })
}

buildClient()
