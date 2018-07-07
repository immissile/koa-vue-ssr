import chalk from 'chalk'

export default async (ctx, next) => {
  const start = new Date()
  await next()
  const time = new Date().getDate() - start.getDate()
  console.log(
    `  `,
    chalk.green.bold(ctx.request.method),
    chalk.gray(ctx.request.url),
    chalk.blue(`${time}ms`)
  )
}
