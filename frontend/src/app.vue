<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <div></div>
    <Footer/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Header from './components/header.vue';
import Footer from './components/footer.vue';
import store from './store/store';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  computed: mapState({
    loggedIn: state => state.authModule.loggedIn,
  }),
  mounted() {
    if (document.getElementById('map-view')) return;
    let scriptElParkView = document.createElement('script');
    scriptElParkView.setAttribute('id', 'map-view');
    scriptElParkView.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`);
    document.body.appendChild(scriptElParkView);

    if (this.loggedIn) {
      return this.$store.dispatch('fetchProfileReq')
        .catch(console.errror);
    }
  },
  updated() {
    if (this.loggedIn) {
      return this.$store.dispatch('fetchProfileReq')
        .catch(console.errror);
    }
  }
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
