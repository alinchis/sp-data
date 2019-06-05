import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Query from './views/Query.vue'
// import store from './store/store.js'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/query',
      name: 'query',
      component: Query
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
