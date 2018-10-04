<template>
  <div id="app">
    <Header/>
    <Landing/>
    <Dashboard/>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/header.vue';
import Dashboard from './components/dashboard.vue';
import Landing from './components/landing.vue';
import Footer from './components/footer.vue';
import store from './store/store';

export default {
  name: 'App',
  components: {
    Header,
    Landing,
    Dashboard,
    Footer,
  },
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>
