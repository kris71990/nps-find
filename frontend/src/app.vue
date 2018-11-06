<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
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
    loggedIn: state => state.loggedIn,
  }),
  mounted() {
    let scriptElParkView = document.createElement('script');
    scriptElParkView.setAttribute('id', 'map-view');
    scriptElParkView.setAttribute('src', `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`);
    document.body.appendChild(scriptElParkView);

    if (loggedIn) {
      return this.$store.dispatch('fetchProfileReq')
        .catch(console.error);
    }
  },
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
