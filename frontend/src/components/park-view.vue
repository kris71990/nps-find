<template>
  <div class="single-park">
    <h1>{{ computedPark.fullName }}</h1>
    <ImageCarousel v-if="computedPark.imageUrl" v-bind:parkImages="computedPark.imageUrl.split('\n')" v-bind:imageCaptions="computedPark.imageCaptions.split('\n')"/>
    <p>View page on <a :href=computedPark.url>National Park Service</a></p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ImageCarousel from './image-carousel.vue';

export default {
  name: 'ParkView',
  components: {
    ImageCarousel,
  },
  computed: mapState({
    computedPark: state => state.singlePark,
  })
}
</script>

<style lang="scss">

</style>
