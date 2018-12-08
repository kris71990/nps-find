<template>
  <div id="state-rankings">
    <h2>National Parks by State</h2>
    <div class="list">
      <div v-if="chartRendered === false && mapRendered === false">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>State</th>
              <th>Total Parks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(state, index) in computedStateList" 
                :key="state.stateId" 
            >
              <td>{{ index + 1 }}</td>
              <td>{{ fullStateNames[state.stateId].fullName }}</td>
              <td>{{ state.total }}</td>
            </tr>
          </tbody>
        </table>
        <div class="links">
          <a v-on:click="chartRendered = !chartRendered">See chart</a>
          <a v-on:click="mapRendered = !mapRendered">See map</a>
        </div>
      </div>
    </div>
    <div class="charts">
      <div v-if="chartRendered === true">
        <a v-on:click="chartRendered = !chartRendered">Back</a>

        <StateChart 
          v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"
        />
      </div>
      <div v-if="mapRendered === true">
        <a v-on:click="mapRendered = !mapRendered">Back</a>
        <StateMap 
          v-bind:stateList="computedStateList" v-bind:typeList="computedTypesArr"
        />
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
  .list {
    width: 100%;
    table {
      margin: 0 auto;
      padding-left: 0;
      border: 3px solid black;
      border-collapse: collapse;
      thead {
        background-color: #658E5C;
        border-bottom: 2px solid black;
        th {
          padding: 1em;
          border: 1px solid black;
        }
      }
      tbody {
        background: linear-gradient(#036910, #CEDDD0);
        td {
          border: 1px solid black;
          padding: 1em 3em;
        }
      }
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
    height: 100px;
    margin: 5% auto;
    a {
      border: 2px solid black;
      border-radius: 10px;
      background-color: #336E55;
      padding: 10px;
      margin: 25px;
    }
    a:hover {
      color: #F1E3CB;
      cursor: pointer;
    }
  }
}

@media only screen and (max-width: 500px) {
  #state-rankings {
    .links {
      height: 200px;
      a { 
        margin: 5% auto;
        width: 50%;
        display: block;
      }
    }
  }
}
</style>
