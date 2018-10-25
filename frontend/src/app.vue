<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/header.vue';
import Dashboard from './components/dashboard.vue';
import Landing from './components/landing.vue';
import StateRanking from './components/state-rankings.vue'
import Footer from './components/footer.vue';
import store from './store/store';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  mounted() {
    let scriptEl = document.createElement('script');
    scriptEl.setAttribute('id', 'state-map-loader');
    scriptEl.setAttribute('src', 'https://www.gstatic.com/charts/loader.js');
    document.head.appendChild(scriptEl);
  },
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
