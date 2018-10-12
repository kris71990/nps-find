<template>
  <div v-if="computedStateList" id="state-rankings">
    <h2>National Parks by State</h2>
    <ul>
      <li v-for="(state, index) in computedStateList" :key="state.stateId">
        {{ index + 1 }}.
        {{ fullStateNames[state.stateId] }} - 
        {{ state.total }}
      </li>
    </ul>
    <a v-on:click="create">Click for chart</a>
    <div id="chart-container">
      <canvas id="state-chart"></canvas>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Chart from 'chart.js';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'StateRankings',
  data() {
    return {
      fullStateNames: stateAbbreviations,
    }
  },
  computed: mapState({
      computedStateList: state => state.stateList,
    }),
  methods: {
    generateDataSet() {
      // const keys = this.computedStateList.map((state) => state.stateId);
      // for (let i in keys) {
        
      // }
      this.createChart('state-chart', this.computedStateList);
    },
    createChart(chartId, chartData) {
      console.log(chartData);
      const ctx = document.getElementById('state-chart');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.map((state) => state.stateId),
          datasets: [
            {
              label: 'Total parks by state',
              data: chartData.map((state) => state.total),
              backgroundColor: chartData.map(() => 'black'),
              borderColor: chartData.map(() => 'red'),
              borderWidth: 2,
            },
          ]
        },
        options: {
          responsive: true,
          maxBarThickness: 0.2,
          scales: {
              xAxes: [{
                  stacked: true
              }],
              yAxes: [{
                  stacked: true
              }]
          }
        }
      })
    }
  } 
}
</script>

<style lang="scss">
#state-rankings {
  width: 95%;
  margin: 0 auto;
  #chart-container {
    margin: 0 auto;
    width: 50%;
  }
  ul {
    padding-left: 0px;
    li {
      margin: 1%;
      list-style-type: none;
    }
  }
}
</style>
