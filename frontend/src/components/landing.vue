<template>
  <div id="home">
    <SearchForm/>
  </div>
</template>

<script>
import SearchForm from './search-form.vue';

export default {
  name: 'Landing',
  components: {
    SearchForm,
  }
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
}
</style>
