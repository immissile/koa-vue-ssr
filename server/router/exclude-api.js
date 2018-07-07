/**
 * excluded /api request
 */

import {isProd} from '@s/utils'

export default (router, prepare) => {
  router.all(
    /^(?!\/api)(?:\/|$)/,
    isProd
      ? prepare.render
      : (ctx, next) => prepare.view.ready.then(() => prepare.render(ctx, next))
  )
}
