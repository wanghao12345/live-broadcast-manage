import Vue from 'vue'
import Router from 'vue-router'
import BroadCastRoom from '../page/BroadCastRoom'
import Login from '../page/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/room/:currAccountId/:liveId',
      name: 'BroadCastRoom',
      component: BroadCastRoom
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    }
  ]
})
