<template>
  <div id="search-results" >
    <h1>{{ computedState }}</h1>
    <div v-if="computedInterests.length > 0">
      <ParkPanel :parks="computedParks" :interests="computedInterests" :total="computedTotal" :state="computedStateAbbrev"/>
    </div>
    <div v-else id="all-parks">
      <h3>National Parks in {{ computedState }} ({{ computedTotal }})</h3>
      <ul id="park-list">
        <li v-for="item in computedParks" :key="item.id">
          <p>{{ item.fullName }}</p>
          <ImageCarousel v-if="item.imageUrl" v-bind:parkImages="item.imageUrl.split('\n')" v-bind:imageCaptions="item.imageCaptions.split('\n')"/>
        </li>
      </ul> 
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';
import ParkPanel from './park-panel.vue';

export default {
  name: 'Dashboard',
  components: {
    ImageCarousel,
    ParkPanel,
  },
  computed:
    mapState({
      computedParks: state => state.parkModule.parks,
      computedState: state => state.parkModule.stateFull,
      computedStateAbbrev: state => state.parkModule.stateAbbrev,
      computedTotal: state => state.parkModule.parksTotal,
      computedInterests: state => state.parkModule.interests,
    }),
}
</script>

<style lang="scss">
#all-parks {
  width: 95%;
  margin: 3% auto;
  #park-list {
    padding-left: 0px;
    li {
      margin-top: 3%;
      margin-bottom: 5%;
      list-style-type: none;
    }
  }
}
</style>
