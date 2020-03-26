import Vue from 'vue'
import Router from 'vue-router'
import BroadCastRoom from '@/page/BroadCastRoom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BroadCastRoom',
      component: BroadCastRoom
    }
  ]
})
