<template>
  <div v-if="computedResults" id="search-results" >
    {{ computedResults }}
  </div>
</template>

<script>
import store from '../store/store';

export default {
  name: 'Dashboard',
  computed: {
    computedResults () {
      return this.$store.getters.getParks;
    }
  }
}
</script>

<style lang="scss">

</style>
