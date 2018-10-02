<template>
  <div id="app">
    <Header/>
    <Landing/>
    <Footer/>
  </div>
</template>

<script>
import Header from './components/header.vue'
import Landing from './components/landing.vue'
import Footer from './components/footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Landing,
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
