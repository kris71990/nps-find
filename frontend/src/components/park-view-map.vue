<template>
  <div id="map"></div>
</template>

<script>
export default {
  name: 'MapView',
  mounted: function() {
    const myLatLng = {lat: -25.363, lng: 131.044};

    const map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 4
    });

    const marker = new google.maps.Marker({
      map: map,
      position: myLatLng,
      title: 'Hello World!'
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
