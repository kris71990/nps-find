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
    let scriptElParkView = document.createElement('script');
    scriptElParkView.setAttribute('id', 'map-view');
    scriptElParkView.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`);
    document.body.appendChild(scriptElParkView);
  },
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
