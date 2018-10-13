<template>
  <div v-if="computedStateList" id="state-rankings">
    <h2>National Parks by State</h2>
    <div v-if="chartRendered === false && mapRendered === false">
      <ul>
        <li v-for="(state, index) in computedStateList" :key="state.stateId">
          {{ index + 1 }}.
          {{ fullStateNames[state.stateId] }} - 
          {{ state.total }}
        </li>
      </ul>
      <a v-on:click="chartRendered = !chartRendered">Click for chart</a>
      <a v-on:click="mapRendered = !mapRendered">Click for map</a>
    </div>
    <div v-if="chartRendered === true">
      <a v-on:click="chartRendered = !chartRendered">Back</a>
      <StateChart v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"/>
    </div>
    <div v-if="mapRendered === true">
      <a v-on:click="mapRendered = !mapRendered">Back</a>
      <StateMap v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import StateChart from './state-chart.vue';
import StateMap from './state-map.vue';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'StateRankings',
  components: {
    StateChart,
    StateMap,
  },
  data() {
    return {
      fullStateNames: stateAbbreviations,
      chartRendered: false,
      mapRendered: false,
    }
  },
  computed: mapState({
      computedStateList: state => state.stateList,
      computedTypesArr: state => state.typesList,
    }),
}
</script>

<style lang="scss">
#state-rankings {
  width: 95%;
  margin: 0 auto;
  ul {
    padding-left: 0px;
    li {
      margin: 1%;
      list-style-type: none;
    }
  }
  a {
    border: 2px solid black;
    border-radius: 10px;
    background-color: #336E55;
    padding: 10px;
  }
}
</style>
