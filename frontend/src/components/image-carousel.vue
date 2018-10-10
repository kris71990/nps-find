<template>
  <div class='carousel-view'>
    <transition-group
      class='carousel'
      tag="div">
      <div
        :index="index"
        class='slide'
        :key="index"
      >
        <div v-if="parkImages[index]">
          <img v-bind:src="parkImages[index]"/>
        </div>
      </div>
    </transition-group>
    <div>
      <button @click="validateIndexLow">Previous</button>
      <button @click="validateIndexHigh">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  data() {
    return {
      index: 0,
    }
  },
  props: {
    parkImages: Array,
  },
  methods: {
    randomizedImage:
      function(park) {
        const arr = park.imageUrl.split('\n');
        arr.pop()
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[this.index];
      }, 
    validateIndexLow: 
      function() {
        if (this.index === 0) {
          this.index = this.parkImages.length - 2
          return this.index;
        }
        if (this.index >= 1) this.index -= 1;
      },
    validateIndexHigh: 
      function() {
        if (this.index === this.parkImages.length - 2) {
          this.index = 0
          return this.index;
        }
        if (this.index < this.parkImages.length - 2) this.index += 1;
      },
  }
}
</script>

<style lang="scss">
.carousel-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  .carousel {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .slide {
      transition: transform 0.3s ease-in-out;
      img {
        width: 40%;
        height: auto;
        border: 8px groove #336E55;
      }
    }
  }
}
</style>
