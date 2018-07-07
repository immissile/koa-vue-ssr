import koaRouter from 'koa-router'

const router = new koaRouter()

router.get('/api/v1/xxx', async (ctx, next) => {
  ctx.body = apiResult({data: ctx.headers})
})

export default router
