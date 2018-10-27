import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/Admin'
import Accounts from '@/components/Accounts'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/transactions/',
      name: 'Accounts',
      component: Accounts
    },
    {
      path: '/admin/',
      name: 'Admin',
      component: Admin
    }
  ]
})
