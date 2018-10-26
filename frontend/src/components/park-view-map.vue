<template>
  <div id="map"></div>
</template>

<script>
export default {
  name: 'MapView',
  props: {
    coordinates: String,
    parkName: String,
  },
  mounted: function() {
    const renderableCoords = this.coordinates.split(', ');
    console.log(renderableCoords);
    const latLong = {
      lat: parseFloat(renderableCoords[0].slice(4)), 
      lng: parseFloat(renderableCoords[1].slice(5)),
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      center: latLong,
      zoom: 7,
    });

    const marker = new google.maps.Marker({
      map: map,
      position: latLong,
      title: this.parkName,
    });
  },
}
</script>

<style lang="scss">
#map {
  height: 300px;
  width: 100%;
}
</style>
