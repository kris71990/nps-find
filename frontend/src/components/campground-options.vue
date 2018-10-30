<template>
  <div>
    <h1>Camping in {{ computedPark.name }}</h1>
    <div class="campground-view">
      <div class="list">
        <ul>
          <li v-for="cg in computedCampgrounds" :key="cg.id">
            <p @click="viewDetails(cg)">{{ cg.name }}</p>
          </li>
        </ul>
      </div>
      <div class="view">
        <CampgroundView v-if="selected" v-bind:campground="selected"/>
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

      return this.selected ? 
        this.selected.name === e.name ? this.selected = null : this.selected = e 
      : this.selected = e;
    }
  }
}
</script>

<style lang="scss">
.campground-view {
  display: flex;
  .list {
    width: 45%;
  }
  .view {
    width: 45%;
  }
}
ul {
  list-style-type: none;
  padding: 0;
}
</style>
