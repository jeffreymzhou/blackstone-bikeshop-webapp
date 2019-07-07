import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import CheckIn from './views/CheckIn.vue'
import AddUser from './views/AddUser.vue'
import AllUsers from './views/AllUsers.vue'
import UserDashboard from './views/UserDashboard.vue'
import AdminPanel from './views/AdminPanel.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: CheckIn
    },
    {
      path: '/adduser',
      name: 'adduser',
      component: AddUser
    },
    {
      path: '/allusers',
      name: 'allusers',
      component: AllUsers
    },
    {
      path: '/user/:id',
      name: 'userdashboard',
      component: UserDashboard
    },
    {
      path: '/admin',
      name: 'adminpanel',
      component: AdminPanel
    }
  ]
})
