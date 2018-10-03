import Vue from 'vue';
import Router from 'vue-router';
import Landing from '../app.vue';
import Dashboard from '../components/dashboard.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Landing,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
  ],
});
