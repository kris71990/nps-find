<template>
  <div class="options">
    <div v-if="computedPark">
      <h1>Camping in {{ computedPark.name }}</h1>
      <p>{{ computedCampgrounds.length }} found in {{ computedPark.fullName }}</p>
    </div>
    <div v-else>
      <h1>Campgrounds in {{ computedState }}</h1>
      <p>{{ computedCampgrounds.length }} found in {{ computedState }}</p>
    </div>
    <div class="campground">
      <div class="list">
        <ul>
          <li v-for="cg in computedCampgrounds" :key="cg.id" v-bind:class="{ focus: activeCampground === cg.id, listItems: activeList }">
            <p @click="viewDetails(cg)">{{ cg.name }}</p>
          </li>
        </ul>
      </div>
      <div v-if="selected" class="view">
        <CampgroundView v-bind:campground="selected" class="campground-view fadeIn"/>
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
      activeCampground: 0,
      activeList: false, 
    }
  },
  components: {
    CampgroundView,
  },
  computed:
    mapState({
      computedPark: state => state.parkModule.singlePark,
      computedState: state => state.parkModule.stateFull,
      computedCampgrounds: state => state.campgroundModule.campgrounds,
    }),
  methods: {
    viewDetails: function(e, cg) {
      if (this.selected) {
        if (this.selected.name === e.name) {
          this.activeList = !this.activeList;
          this.selected = null;
          this.activeCampground = 0;
        } else {
          this.activeCampground = e.id;
          this.selected = e;
        }
      } else {
        this.activeList = !this.activeList;
        this.activeCampground = e.id;
        this.selected = e;
      }
    }
  }
}
</script>

<style lang="scss">
.campground {
  display: flex;
  flex-direction: row;
  margin: 0 2% 5% 2%;
  .list {
    width: 40%;
    margin: 0 auto;
    float: left;
    ul {
      list-style-type: none;
      padding: 0;
      li {
        text-align: center;
        height: 100%;
        background-color: #81B2A2;
        width: 100%;
        border: 1px solid black;
        box-sizing: border-box;
        letter-spacing: 0.3em;
        color: black;
        -webkit-animation-duration: 3s;
        animation-duration: 3s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation-name: fadeIn;
        animation-name: fadeIn;
      }
    }
    .listItems {
      background: repeating-linear-gradient(-30deg, #B8B8B8, #B8B8B8 1px, #808080 3px, #808080 4px);
      text-align: left;
      padding-left: 2%;
    }
    .focus {
      p {
        text-align: right;
        padding-right: 2%;
      }
      background: none;
      background-color: #09C184;
      color: black;
      font-weight: bold;
      font-style: italic;
      border: 5px solid #037A53;
      box-sizing: border-box;
    }
  }
  .view {
    width: 60%;
    margin: 0 auto;
    .select-message {
      font-size: 1.2em;
    }
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
    -webkit-animation-duration: 3s;
    animation-duration: 3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
}
</style>
