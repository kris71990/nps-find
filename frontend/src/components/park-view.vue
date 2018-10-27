<template>
  <div class="single-park">
    <h1>{{ computedPark.fullName }}</h1>
    <div class="image-box">
      <MapView
      v-bind:coordinates="computedPark.latLong"
      v-bind:parkName="computedPark.name"
      />
      <ImageCarousel v-if="computedPark.imageUrl"
      v-bind:parkImages="computedPark.imageUrl.split('\n')" v-bind:imageCaptions="computedPark.imageCaptions.split('\n')"
      />
    </div>
    <div class="info-box">
      <h3>Park details...</h3>
      <p>{{ computedPark.description }}</p>
      <h3>How to get here...</h3>
      <p>{{ computedPark.directionsInfo }}</p>
      <h3>Weather...</h3>
      <p>{{ computedPark.weatherInfo }}</p>
      <h3>Camping...</h3>
      <p>View page on <a :href=computedPark.url>National Park Service</a></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';
import MapView from './park-view-map.vue';

export default {
  name: 'ParkView',
  components: {
    ImageCarousel,
    MapView,
  },
  computed: mapState({
    computedPark: state => state.singlePark,
  })
}
</script>

<style lang="scss">
.single-park {
  h1 {
    background: repeating-linear-gradient(60deg, #076B69, #016AAB 30%,#73C9C7);
    border-bottom: 3px solid black;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 2em;
  }
  .info-box {
    width: 60%;
    line-height: 2;
    text-align: left;
    margin: 0 auto 5%;
    background-color: #E8EAEB;
    border: 5px dashed grey;
    padding: 2%;
    h3 {
      text-decoration: underline;
    }
  }
}
</style>
