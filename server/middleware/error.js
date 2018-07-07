// 404
exports.notFound = async (ctx, next) => {
  // ctx.type = 'html'
  ctx.body = apiResult({code: 404, error: `Not Found`})
}

// 500
exports.internal = (ctx, error) => {
  ctx.status = 500
  ctx.body.end('Internal Server Error: 500')
  console.error(`error during render : ${ctx.url}`)
  console.error(error.stack)
}
