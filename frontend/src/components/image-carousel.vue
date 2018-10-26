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
          <p>{{ imageCaptions[index] }}</p>
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
    imageCaptions: Array,
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
  margin-bottom: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .carousel {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .slide {
      margin-top: 1%;
      transition: transform 0.3s ease-in-out;
      img {
        width: 40%;
        height: auto;
        border: 8px groove #336E55;
      }
      p {
        width: 40%;
        margin: 2% auto;
      }
    }
  }
  button {
    border-radius: 5px;
    border: 1px solid #00558C;
    background-color: #5199C7;
  }
  button:hover {
    border: 1px solid #000A6A;
    transform: scale(1.05,1.05);
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
}
</style>
