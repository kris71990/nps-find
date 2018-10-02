<template>
  <div class="search-form">
    <h1>Enter a state to find National Parks near you</h1>
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
      state: 'CA',
    }
  }
}
</script>

<style lang="scss">
.button {
  margin: 1%;

  button {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid black;
  }

  button:hover {
    background-color: tan;
    border: 2px solid white;
  }
}
</style>