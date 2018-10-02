<template>
  <div id="home">
    <SearchForm/>
    <SearchResults/>
  </div>
</template>

<script>
import SearchForm from './search-form.vue';
import SearchResults from './search-results.vue'

export default {
  name: 'Landing',
  components: {
    SearchForm,
    SearchResults,
  }
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
}
</style>
