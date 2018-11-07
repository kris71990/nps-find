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
      <div>
        <p v-if="computedPark.camping">
          See <span @click="getCampgrounds">camping</span> options in {{ computedPark.name }}.
        </p>
        <p v-else>No camping available.</p> 
      </div>
      <p>View page on <a :href=computedPark.url target="_blank">National Park Service</a></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';
import MapView from './park-view-map.vue';
import CampgroundOptions from './campground-options.vue';

export default {
  name: 'ParkView',
  components: {
    ImageCarousel,
    MapView,
    CampgroundOptions,
  },
  computed: mapState({
    computedPark: state => state.parkModule.singlePark,
  }),
  methods: {
    getCampgrounds: function() {
      const { pKeyCode, parkCode } = this.computedPark;
      return this.$store.dispatch('getCampgrounds', { pKeyCode, parkCode })
        .then(() => {
          this.$router.push(`/park/${parkCode}/campgrounds`);
        });
    }
  }
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
    span {
      color: grey;
      font-weight: bold;
    }
    span:hover {
      cursor: pointer;
      color: #00CB94;
    }
  }
}
</style>
