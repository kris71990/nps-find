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
    let renderableCoords;
    const defaultLatLong = { 
      lat: 37.969001, 
      lng: -98.802018,
    }
    
    let latLong;
    let mapZoom;
    
    if (this.coordinates) {
      renderableCoords = this.coordinates.split(', ') 
      latLong = {
        lat: parseFloat(renderableCoords[0].slice(4)), 
        lng: parseFloat(renderableCoords[1].slice(5)),
      };
      mapZoom = 7;
    } else {
      latLong = defaultLatLong;
      mapZoom = 4;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      center: latLong,
      zoom: mapZoom,
      mapTypeId: 'terrain',
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
