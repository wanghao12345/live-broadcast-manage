import Vue from 'vue'
import Router from 'vue-router'
import BroadCastRoom from '../page/BroadCastRoom'
import Login from '../page/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BroadCastRoom',
      component: BroadCastRoom
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
