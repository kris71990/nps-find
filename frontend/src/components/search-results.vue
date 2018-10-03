<template v-if="results">
  <div id="search-results">
    {{ results }}
  </div>
</template>

<script>
export default {
  name: 'SearchResults',
  props: {
    parks: Object,
  },
  data() {
    return {
      results: null,
    }
  },
}
</script>


<style lang="scss">

</style>
