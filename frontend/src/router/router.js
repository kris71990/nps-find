import Vue from 'vue';
import Router from 'vue-router';
import App from '../app.vue';
import SearchResults from '../components/search-results.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: App,
    },
    {
      path: '/search',
      name: 'Search Results',
      component: SearchResults,
    },
  ],
});
