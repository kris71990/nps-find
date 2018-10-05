<template>
  <div class="search-form">
    <h3>Enter a state to find National Parks near you</h3>
    <form @submit="handleSubmit">
      <input 
        v-model.lazy="stateSelection"
        type="text" 
        name="state"
        placeholder="ex. CA"
      />
      <div class="button">
        <button type="submit">
          Find parks in {{ stateSelection }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    handleSearch: Function,
  },
  data() {
    return {
      stateSelection: null,
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      return this.handleSearch(this.stateSelection)
        .then(() => this.stateSelection = null);
    }
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