<template v-if="results === null">
  <div id="home">
    <SearchForm/>
  </div>
</template>

<script>
import SearchForm from './search-form.vue';

export default {
  name: 'Landing',
  props: {
    state: String,
    handleSearch: Function,
  },
  components: {
    SearchForm,
  },
  data() {
    return {
      results: null,
    }
  }
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
}
</style>
