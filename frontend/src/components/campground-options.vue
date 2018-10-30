<template>
  <div class="options">
    <h1>Camping in {{ computedPark.name }}</h1>
    <div class="campground">
      <div class="list">
        <ul>
          <li v-for="cg in computedCampgrounds" :key="cg.id">
            <p v-bind:class="{ focus: showCampground }" @click="viewDetails(cg)">{{ cg.name }}</p>
          </li>
        </ul>
      </div>
      <div class="view">
        <CampgroundView v-if="selected" v-bind:campground="selected" class="campground-view fadeIn"/>
      </div>  
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CampgroundView from './campground-view.vue';

export default {
  name: 'CampgroundOptions',
  data() {
    return {
      selected: null,
      showCampground: false,
    }
  },
  components: {
    CampgroundView,
  },
  computed:
    mapState({
      computedPark: state => state.singlePark,
      computedState: state => state.stateFull,
      computedCampgrounds: state => state.campgrounds,
    }),
  methods: {
    viewDetails: function(e, cg) {
      if (this.selected) {
        if (this.selected.name === e.name) {
          this.selected = null;
          this.showCampground = !this.showCampground;
        } else {
          this.selected = e;
        }
      } else {
        this.selected = e;
        this.showCampground = !this.showCampground;
      }
    }
  }
}
</script>

<style lang="scss">
.campground {
  display: flex;
  flex-direction: row;
  .list {
    text-align: right;
    width: 50%;
    margin: 0 auto;
    border: 2px solid black;
  }
  .focus {
    text-align: center;
    -webkit-animation-duration: 5s;
    animation-duration: 5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }
  .view {
    width: 50%;
    margin: 0 auto;
    border: 2px solid black;
  }
}
ul {
  list-style-type: none;
  padding: 0;
}

@-webkit-keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}

@keyframes fadeIn {
  0% { opacity: 0 }
  100% { opacity: 1 }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

.campground-view {
  text-align: left;
  -webkit-animation-duration: 5s;
  animation-duration: 5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
</style>
