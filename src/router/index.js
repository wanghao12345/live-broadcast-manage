import Vue from 'vue'
import Router from 'vue-router'
import BroadCastRoom from '../page/BroadCastRoom'
import Login from '../page/Login'
import Demo1 from '../page/Demo1'
import Demo2 from '../page/Demo2'

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
    },
    {
      path: '/demo1',
      name: 'Demo1',
      component: Demo1
    },
    {
      path: '/demo2',
      name: 'Demo2',
      component: Demo2
    }
  ]
})
