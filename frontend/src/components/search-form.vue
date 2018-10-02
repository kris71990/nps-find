<template>
  <div class="search-form">
    <h3>Enter a state to find National Parks near you</h3>
    <form>
      <input 
        v-model="state"
        type="text" 
        name="state"
        placeholder="ex. CA"
      />
      <div class="button">
        <button>Find parks in {{ state }}</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  data() {
    return {
      state: null,
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