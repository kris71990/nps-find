import Vue from 'vue';
import Router from 'vue-router';
import Landing from '../components/landing.vue';
import CommonReturn from '../components/common-return.vue';
import Dashboard from '../components/dashboard.vue';
import StateRankings from '../components/state-rankings.vue';
import ParkView from '../components/park-view.vue';
import ProfileView from '../components/profile-view.vue';
import CampgroundOptions from '../components/campground-options.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Landing,
    },
    {
      path: '/login',
      name: 'HomeLogin',
      component: Landing,
    },
    {
      path: '/signup',
      name: 'HomeSignup',
      component: Landing,
    },
    {
      path: '/profile',
      name: 'ProfileView',
      component: ProfileView,
    },
    {
      path: '/search',
      name: 'CommonReturn',
      component: CommonReturn,
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
      path: '/park/:id',
      name: 'ParkView',
      component: ParkView,
    },
    {
      path: '/park/:id/report',
      name: 'ParkPostReport',
      component: ParkView,
    },
    {
      path: '/park/:id/campgrounds',
      name: 'CampgroundOptions',
      component: CampgroundOptions,
    },
    {
      path: '/campgrounds/:state',
      name: 'CampgroundsState',
      component: CampgroundOptions,
    },
  ],
});
