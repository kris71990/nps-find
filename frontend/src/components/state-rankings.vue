<template>
  <div v-if="computedStateList" id="state-rankings">
    <h2>National Parks by State</h2>
    <div v-if="chartRendered === false">
      <ul>
        <li v-for="(state, index) in computedStateList" :key="state.stateId">
          {{ index + 1 }}.
          {{ fullStateNames[state.stateId] }} - 
          {{ state.total }}
        </li>
      </ul>
      <a v-on:click="chartRendered = !chartRendered">Click for chart</a>
    </div>
    <div v-if="chartRendered === true">
      <a v-on:click="chartRendered = !chartRendered">Back</a>
      <StateChart v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import StateChart from './state-chart.vue';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'StateRankings',
  components: {
    StateChart,
  },
  data() {
    return {
      fullStateNames: stateAbbreviations,
      chartRendered: false,
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
}
</style>
