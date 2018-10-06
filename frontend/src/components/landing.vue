<template>
  <div id="home" v-if="!computedParks">
    <SearchForm :handleSearch="handleSearch"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      stateFull: null,
    }
  },
  methods: {
    handleSearch(event, a, b) {
      this.state = event.state;
      this.stateFull = event.stateFull;
      return this.$store.dispatch('foundParks', { state: this.state, stateFull: this.stateFull })
        .then(() => {
          this.$router.push('/dashboard');
        });
    },
  },
  computed: mapState({
    computedParks: state => state.parks,
  }),
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
}
</style>
