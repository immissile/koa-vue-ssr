import LRU from 'lru-cache'
import {PassThrough} from 'stream'
import {internal} from '@s/middleware/error'
import View from '@s/view'

const useMicroCache = process.env.MICRO_CACHE !== 'false'
const cacheUrls = [
  '/',
  '/home',
  '/menu',
  '/button'
]

const isCacheable = ctx => cacheUrls.indexOf(ctx.url) >= 0 && useMicroCache

const microCache = LRU({
  max: 100,
  maxAge: 1200
})

module.exports = app => {
  // create vue renderer instance
  const view = new View(app)

  async function render (ctx, next) {
    // render middleware
    ctx.type = 'html'

    ctx.body = new PassThrough()

    if (!view.renderer) {
      return ctx.body.end('Compileing...')
    }

    // hit micro cache
    const cacheable = isCacheable(ctx)
    if (cacheable) {
      const html = microCache.get(ctx.url)
      if (html) {
        ctx.set('X-Cache-Hit', '1')
        return ctx.body.end(html)
      }
    }

    function handleError (error) {
      // console.error('RENDER ERROR', error)
      if (error.url) {
        // fixed stream.push after EOF
        return ctx.redirect(error.url)
      } else if (error.code === 404) {
        // ctx.status = 404
        // ctx.body.end('111 404 | Page Not Found')
        // vue-router 404 hook will catch this part
      } else {
        // Render Error Page or Redirect
        internal(ctx, error)
      }
    }

    function handleEnd (content) {
      if (cacheable) {
        // set micro cache
        microCache.set(ctx.url, content)
      }
      ctx.body.end(content)
    }

    try {
      const context = {
        title: '',
        url: ctx.url
      }
      const content = await view.render(context)
      handleEnd(content)
    } catch (error) {
      handleError(error)
    }
  }

  return {view, render}
}
