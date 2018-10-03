<template v-if="parks">
  <div class="search-form">
    <h3>Enter a state to find National Parks near you</h3>
    <form v-on:submit.prevent="handleSubmit">
      <input 
        v-model.lazy="state"
        type="text" 
        name="state"
        placeholder="ex. CA"
      />
      <div class="button">
        <router-link to="/search" tag="button" type="submit">
          Find parks in {{ state }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import superagent from 'superagent';

export default {
  name: 'SearchForm',
  props: {
    handleSearch: Function,
  },
  data() {
    return {
      parks: null,
      state: null,
    }
  },
  methods: {
    handleSubmit() {
      return superagent.get(`${API_URL}/search`)
        .then((response) => {
          this.parks = response.body.data;
        })
        .then(() => store.commit('increment', this.state))
    },
  }
}
</script>

<style lang="scss">
.button {
  margin: 1%;

  button {
    background-color: rgb(126, 182, 112);
    padding: 10px;
    border-radius: 5px;
    border: 2px solid #336E55;
  }

  button:hover {
    background-color: #336E55;
    color: #F1E3CB;
  }
}
</style>