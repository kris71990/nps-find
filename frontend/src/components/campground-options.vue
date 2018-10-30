<template>
  <div class="campground-list">
    <h1>Camping in {{ computedPark.name }}</h1>
    <ul>
      <li v-for="cg in computedCampgrounds" :key="cg.id">
        <p @click="viewDetails(cg)">{{ cg.name }}</p>
      </li>
    </ul>
    <CampgroundView v-if="selected"/>
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
ul {
  list-style-type: none;
  padding: 0;
}
</style>
