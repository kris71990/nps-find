import Vue from 'vue';
import Router from 'vue-router';
import Landing from '../components/landing.vue';
import Dashboard from '../components/dashboard.vue';
import StateRankings from '../components/state-rankings.vue';
import ParkView from '../components/park-view.vue';

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
    {
      path: '/states',
      name: 'States',
      component: StateRankings,
    },
    {
      path: '/park',
      name: 'ParkView',
      component: ParkView,
    },
  ],
});
