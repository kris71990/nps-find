import Vue from 'vue';
import App from './app.vue';
import router from './router/router';
import store from './store/store';

new Vue({ /* eslint-disable-line */
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>',
}).$mount('#app');
