<template>
  <div id="app">
    <Header/>
    <Landing/>
    <StateRanking/>
    <Dashboard/>
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
    Landing,
    StateRanking,
    Dashboard,
    Footer,
  },
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
