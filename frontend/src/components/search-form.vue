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
      <button>Find parks in {{ state }}</button>
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