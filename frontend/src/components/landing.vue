<template>
  <div id="home" v-if="!computedParks">
    <SearchForm :handleSearch="handleSearch"/>
  </div>
</template>

<script>
import SearchForm from './search-form.vue';

export default {
  name: 'Landing',
  components: {
    SearchForm,
  },
  data() {
    return {
      parks: null,
      state: null,
    }
  },
  methods: {
    handleSearch(event) {
      this.state = event;
      return this.$store.dispatch('foundParks', this.state)
        .then(() => {
          this.$router.push('/dashboard');
        });
    },
  },
  computed: {
    computedParks () {
      return this.$store.getters.getParks;
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
