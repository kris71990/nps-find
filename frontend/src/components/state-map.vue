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
    let scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', 'https://www.gstatic.com/charts/loader.js');
    document.head.appendChild(scriptEl);
    return this.loadMap();

    // google.charts.load('current', {
    //   'packages': ['geomap'],
    //   'mapsApiKey': process.env.GOOGLE_API_KEY,
    // });
    // google.charts.setOnLoadCallback(drawMap);
  },
  beforeDestroy() {
    const mapEl = document.getElementById('state-map');
    mapEl.clearChart();
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
      let data = google.visualization.arrayToDataTable([
        ['State', 'Total Parks'],
      ]);
      let options = {
        region: 'US',
        displayMode: 'regions',
        resolution: 'provinces',
      };
      let container = document.getElementById('state-map');
      let geomap = new google.visualization.GeoChart(container);
      geomap.draw(data, options);
    }
  }
}
</script>

<style lang="scss">

</style>
