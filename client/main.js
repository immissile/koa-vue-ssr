import Vue from 'vue'
import {sync} from 'vuex-router-sync'
import App from '@/App'
import {createStore} from '@/store'
import {createRouter} from '@/router'
import title from '@/mixins/title'
import ElementUI from 'element-ui'

Vue.mixin(title)
Vue.use(ElementUI)

export function createApp () {
  const router = createRouter()
  const store = createStore()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return {app, router, store}
}
