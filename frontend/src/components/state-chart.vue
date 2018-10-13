<template>
  <div id="chart-container">
    <canvas id="state-chart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js';
import { parkTypeColors } from '../utils/colors';

export default {
  name: 'StateChart',
  props: {
    stateList: Array,
    typeList: Array,
  },
  mounted() {
    return this.generateDataSet();
  },
  methods: {
    generateDataSet(event, a, b) {
      return this.$store.dispatch('setTypes')
        .then(() => {
          const datasetArr = this.typeList.map((type) => {
            const color = parkTypeColors[type];
            const stateTotal = this.stateList.map((state) => {
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
            stateList: this.stateList,
            typeArr: datasetArr,
          });
        })
    },
    createChart(chartId, chartData) {
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
#chart-container {
  position: relative;
  margin: 0 auto;
  width: 80%;
}
</style>
