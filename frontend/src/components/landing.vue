<template>
  <div id="home" v-if="!computedParks && !stateList">
    <SearchForm :handleSearch="handleSearch"/>
    <div id="states">
      <h4>Or see an <a v-on:click="getStateList">overview</a> of all parks</h4>
    </div>
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
    getStateList(event, a, b) {
      return this.$store.dispatch('stateChart')
        .then(() => {
          this.$router.push('/states');
        })
    }
  },
  computed: mapState({
    computedParks: state => state.parks,
    stateList: state => state.stateList,
  }),
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
  a {
    color: #336E55;
  }
  a:hover {
    color: #11C68A;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
