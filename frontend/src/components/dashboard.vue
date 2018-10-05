<template>
  <div v-if="computedParks" id="search-results" >
    <h3>National Parks in {{ computedState }}</h3>
    <ul id="park-list">
      <li v-for="item in computedParks" :key="item.id">
        {{ item.fullName }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    computedParks () {
      return this.$store.getters.getParks;
    },
    computedState () {
      return this.$store.getters.getState;
    },
  }
}
</script>

<style lang="scss">
#search-results {
  padding: 3%;
  ul {
    margin: 5%;
    padding-left: 0px;
    li {
      margin: 1%;
      list-style-type: none;
    }
  }
}
</style>
