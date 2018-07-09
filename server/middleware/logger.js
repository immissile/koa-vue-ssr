import chalk from 'chalk'
import config from 'config'
import isEqual from 'lodash/isEqual'
import utils from '@s/utils'
import detect from 'detect-port'

export const env = () => {
  console.clear()
  console.log(
    chalk.bold('NODE_ENV'),
    chalk.keyword('orange').bold(process.env.NODE_ENV)
  )
  console.log()
}

export const listening = async (context, host, port) => {
  let cport = await detect(config.port)
  if (!isEqual(config.port, cport)) {
    console.log(chalk.green.bold(`Server Updated successfully.`), `\n`)
    return
  }
  const SERVER_API = 'Api Server'
  const SERVER_CLIENT = 'Client Server'
  if (isEqual(context, 'SERVER')) {
    console.log(
      chalk.cyan.bold(SERVER_API),
      utils.printBlankSpace(15 - SERVER_API.length),
      chalk.blue(`http://${host}:${port}`)
    )
  } else {
    console.log(
      chalk.cyan.bold(SERVER_CLIENT),
      utils.printBlankSpace(15 - SERVER_CLIENT.length),
      chalk.blue(`http://${host}:${port}`)
    )
    console.log()
    if (!utils.isProd) {
      console.log(
        ` `,
        chalk.gray(`Open browser and visit ${SERVER_CLIENT}`,)
      )
      console.log()
      console.log()
    }
  }
  if (utils.isProd) {
    console.log()
  }
}

export default {
  env,
  listening
}
