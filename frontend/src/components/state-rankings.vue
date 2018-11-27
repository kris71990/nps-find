<template>
  <div id="state-rankings">
    <h2>National Parks by State</h2>
    <div class="list">
      <div v-if="chartRendered === false && mapRendered === false">
        <ul>
          <li v-for="(state, index) in computedStateList" :key="state.stateId">
            {{ index + 1 }}.
            {{ fullStateNames[state.stateId].fullName }} - 
            {{ state.total }}
          </li>
        </ul>
        <div class="links">
          <a v-on:click="chartRendered = !chartRendered">Click for chart</a>
          <a v-on:click="mapRendered = !mapRendered">Click for map</a>
        </div>
      </div>
    </div>
    <div class="charts">
      <div v-if="chartRendered === true">
        <a v-on:click="chartRendered = !chartRendered">Back</a>
        <StateChart v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"/>
      </div>
      <div v-if="mapRendered === true">
        <a v-on:click="mapRendered = !mapRendered">Back</a>
        <StateMap v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import StateChart from './state-chart.vue';
import StateMap from './state-map.vue';
import { stateData } from '../utils/states';

export default {
  name: 'StateRankings',
  components: {
    StateChart,
    StateMap,
  },
  data() {
    return {
      fullStateNames: stateData,
      chartRendered: false,
      mapRendered: false,
    }
  },
  computed: mapState({
      computedStateList: state => state.stateModule.stateList,
      computedTypesArr: state => state.stateModule.typesList,
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
  .charts {
    a {
      border: 2px solid black;
      border-radius: 10px;
      background-color: #336E55;
      padding: 5px 20px 5px 20px;
    }
  }
  .links {
    margin: 5%;
    a {
      border: 2px solid black;
      border-radius: 10px;
      background-color: #336E55;
      padding: 10px;
      margin: 25px;
    }
  }
}
</style>
