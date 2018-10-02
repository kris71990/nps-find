import Vue from 'vue';
import App from './app.vue';
// import './style/main.scss';

new Vue({ /* eslint-disable-line */
  el: '#app',
  render: h => h(App),
  components: { App },
  template: '<App/>',
}).$mount('#app');
