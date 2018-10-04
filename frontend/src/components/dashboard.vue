<template>
  <div v-if="computedResults" id="search-results" >
    <h3>National Parks in California</h3>
    <ul id="park-list">
      <li v-for="item in computedResults" :key="item.id">
        {{ item.fullName }}
      </li>
    </ul>
  </div>
</template>

<script>
import store from '../store/store';

export default {
  name: 'Dashboard',
  computed: {
    computedResults () {
      return this.$store.getters.getParks;
    }
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
