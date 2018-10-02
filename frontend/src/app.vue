<template>
  <div id="app">
    <SearchForm/>
  </div>
</template>

<script>
import SearchForm from './components/search-form.vue';

export default {
  name: 'App',
  components: {
    SearchForm
  }
}
</script>

<style lang="scss">
@import './style/main.scss';
</style>