import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Pay from './components/Pay.vue';
import Success from './components/Success.vue';

Vue.use(Router);

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
      path: '/pay',
      name: 'pay',
      component: Pay
    },
    {
      path: '/success',
      name: 'success',
      component: Success
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
