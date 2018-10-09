<template>
  <div class='carousel-view'>
    <transition-group
      class='carousel'
      tag="div">
      <div
        v-for="slide in this.slides" 
        class='slide'
        :key="slide">
        <img src="slide"/>
      </div>
    </transition-group>
    <div class='carousel-controls'>
      <button class='carousel-controls__button' @click="previous">prev</button>
      <button class='carousel-controls__button' @click="next">next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Carousel',
  props: {
    slides: Array,
  },
  methods: {
    next () {
      const first = this.slides.shift()
      this.slides = this.slides.concat(first)
    },
    previous () {
      const last = this.slides.pop()
      this.slides = [last].concat(this.slides)
    }
  }
  // methods: {
  //   randomizedImage:
  //     (park) => {
  //       const index = Math.round(Math.random() * (arr.length - 1));
  //       return arr[index];
  //     }
  // }
}
</script>
