<template>
  <div class='carousel-view'>
    <ul id="park-list">
      <transition-group
        class='carousel'
        tag="li">
        <li
          v-for="item in parks" 
          class='slide'
          :key="item.imageUrl"
        >
          <div v-if="item.imageUrl" :index="index">
            <img v-bind:src="item.imageUrl.split('\n')[index]"/>
            <p>{{ item.fullName }}</p>
            <div>
              <button @click="index -= 1">Previous</button>
              <button @click="index += 1">Next</button>
            </div>
          </div>
          <!-- <div class='carousel-controls' :key="item.imageUrl">
            <button class='carousel-controls__button' @click="previous">prev</button>
            <button class='carousel-controls__button' @click="next">next</button>
          </div> -->
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'Carousel',
  data() {
    return {
      index: 0,
    }
  },
  props: {
    parks: Array,
  },
  // computed: {
  //   next: () => this.index += 1,
  //   previous: () => this.index -= 1,
  // },
  methods: {
    randomizedImage:
      function(park) {
        const arr = park.imageUrl.split('\n');
        arr.pop()
        // const index = Math.round(Math.random() * (arr.length - 1));
        return arr[this.index];
      }, 
    // ...mapMutations({
    //   nextImage: parkImageNext,
    // })
    // next () {
    //   const first = this.parksComputed.shift()
    //   parksComputed = parksComputed.concat(first)
    // },
    // previous () {
    //   const last = parksComputed.pop()
    //   parksComputed = [last].concat(parksComputed)
    // }
  }
//     randomizedImage:
//       (park) => {
//         const index = Math.round(Math.random() * (arr.length - 1));
//         return arr[index];
//       }
//   }
}
</script>
