<template>
  <div v-if="computedParks" id="search-results" >
    <h3>National Parks in {{ computedState }}</h3>
    <!-- <Carousel v-bind:slides="slides"/> -->
    <!-- <ul id="park-list">
      <li v-for="item in computedParks" :key="item.id">
        <div v-if="item.imageUrl">
          <img v-bind:src="randomizedImage(item)"/>
        </div>
        <p>{{ item.fullName }}</p>
      </li>
    </ul> -->
    <div class='carousel-view'>
      <ul id="park-list">
        <transition-group
          class='carousel'
          tag="div">
          <li
            v-for="item in computedParks" 
            class='slide'
            :key="item.imageUrl">
            <div v-if="item.imageUrl">
              <img v-bind:src="randomizedImage(item.imageUrl)"/>
              <p>{{ item.fullName }}</p>
            </div>
            <!-- <div class='carousel-controls' :key="item.imageUrl">
              <button class='carousel-controls__button' @click="previous">prev</button>
              <button class='carousel-controls__button' @click="next">next</button>
            </div> -->
          </li>
        </transition-group>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed:
    mapState({
      computedParks: state => state.parks,
      computedState: state => state.stateFull,
    }),
  methods: {
    randomizedImage:
      (imageUrl) => {
        const arr = imageUrl.split('\n');
        arr.pop()
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
      }, 
    next () {
      const first = this.imageArr.shift()
      imageArr = images.concat(first)
    },
    previous () {
      const last = imageArr.pop()
      imageArr = [last].concat(imageArr)
    }
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
      img {
        width: 45%;
      }
    }
  }
}
</style>
