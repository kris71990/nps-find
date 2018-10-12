<template>
  <div v-if="computedParks" id="search-results" >
    <h3>National Parks in {{ computedState }} ({{ computedTotal }})</h3>
    <ul id="park-list">
      <li v-for="item in computedParks" :key="item.id">
        <ImageCarousel v-if="item.imageUrl" v-bind:parkImages="item.imageUrl.split('\n')"/>
        <p>{{ item.fullName }}</p>
      </li>
    </ul> 
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';

export default {
  name: 'Dashboard',
  components: {
    ImageCarousel,
  },
  computed:
    mapState({
      computedParks: state => state.parks,
      computedState: state => state.stateFull,
      computedTotal: state => state.parksTotal,
    }),
  methods: {
    randomizedImage:
      (park) => {
        const arr = park.imageUrl.split('\n');
        arr.pop()
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
      }, 
  }
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
    }
  }
}
</style>
