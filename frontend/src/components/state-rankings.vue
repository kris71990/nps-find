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
      <a v-on:click="generateDataSet">Click for chart</a>
    </div>
    <div id="chart-container">
      <canvas id="state-chart"></canvas>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Chart from 'chart.js';
import { stateAbbreviations } from '../utils/states';
import { parkTypeColors } from '../utils/colors';

export default {
  name: 'StateRankings',
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
  methods: {
    generateDataSet(event, a, b) {
      return this.$store.dispatch('setTypes')
        .then(() => {
          const datasetArr = this.computedTypesArr.map((type) => {
            const color = parkTypeColors[type];
            const stateTotal = this.computedStateList.map((state) => {
              let typeNum;
              if (state.types[type]) {
                typeNum = state.types[type];
              } else {
                typeNum = 0;
              }
              return typeNum;
            })
            return {
              label: type,
              data: stateTotal,
              backgroundColor: color,
            }
          }) 
          this.createChart('state-chart', { 
            stateList: this.computedStateList,
            typeArr: datasetArr,
          });
        })
    },
    createChart(chartId, chartData) {
      this.chartRendered = true;
      const ctx = document.getElementById('state-chart');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.stateList.map((state) => state.stateId),
          datasets: chartData.typeArr,
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          maxBarThickness: 0.2,
          animation: {
            easing: 'linear',
            duration: 1000,
          },
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
            }
          },
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
    position: relative;
    margin: 0 auto;
    width: 80%;
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
