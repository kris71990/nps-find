<template>
  <div id="home" v-if="!computedParks">
    <SearchForm :handleSearch="handleSearch"/>
  </div>
</template>

<script>
import superagent from 'superagent';
import store from '../store/store';
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
      this.state = event.state;
      return superagent.get(`${API_URL}/search`)
        .then((response) => {
          this.parks = response.body.data;
        })
        .then(() => {
          store.commit('changeState', this.state)
          store.commit('foundParks', this.parks)
        })
        .then(() => {
          this.$router.push('/dashboard');
        })
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
