<template>
  <div v-if="computedParks" id="search-results" >
    <h3>National Parks in {{ computedState }}</h3>
    <ul id="park-list">
      <li v-for="item in computedParks" :key="item.id">
        <div v-if="item.images[0]">
          <img v-bind:src="item.images[0].url"/>
        </div>
        <p>{{ item.fullName }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: mapState({
    computedParks: state => state.parks,
    computedState: state => state.stateFull,
  }),
}
</script>

<style lang="scss">
#search-results {
  width: 95%;
  margin: 3% auto;
  ul {
    padding-left: 0px;
    li {
      margin-top: 3%;
      margin-bottom: 5%;
      list-style-type: none;
      img {
        width: 45%;
      }
    }
  }
}
</style>
