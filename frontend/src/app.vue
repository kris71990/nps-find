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
import Landing from './components/landing.vue';
import Dashboard from './components/dashboard.vue';
import Footer from './components/footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Landing,
    Dashboard,
    Footer,
  }
}
</script>

<style lang="scss">
@import './style/main.scss';

body {
  background-color: #F1E3CB;
  color: #336E55;
}
</style>
