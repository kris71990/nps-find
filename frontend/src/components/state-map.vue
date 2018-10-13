<template>
  <div id="map-container">
    <div id="state-map"></div>
  </div>
</template>

<script>
export default {
  name: 'StateMap',
  props: {
    stateList: Array,
    typeList: Array,
  },
  mounted() {
    google.charts.load('current', {
      'packages': ['geomap'],
      'mapsApiKey': GOOGLE_API_KEY,
    });
    google.charts.setOnLoadCallback(this.drawMap);
  },
  methods: {
    loadMap() {
      console.log(GOOGLE_API_KEY)
      google.charts.load('current', {
        'packages': ['geomap'],
        'mapsApiKey': GOOGLE_API_KEY,
      });
      google.charts.setOnLoadCallback(drawMap);
    },
    drawMap() {
      const stateArr = this.stateList.map((state) => [state.stateId, state.total]);
      stateArr.unshift(['State', 'Total Parks']);
      let data = google.visualization.arrayToDataTable(stateArr);
      let options = {
        region: 'US',
        displayMode: 'regions',
        resolution: 'provinces',
        backgroundColor: '#8EC9EB',
        datalessRegionColor: '#D2D3D3',
        colorAxis: {
          colors: [
            '#CEDDD0',
            '#036910',
          ]
        }
      };
      let container = document.getElementById('state-map');
      let geomap = new google.visualization.GeoChart(container);
      geomap.draw(data, options);
    }
  }
}
</script>

<style lang="scss">
#map-container {
  margin: 5% auto;
  width: 80%;
  border: 10px ridge #336E55;
}
</style>
