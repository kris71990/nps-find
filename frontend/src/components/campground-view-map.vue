<template>
  <div id="campground-map"></div>
</template>

<script>
export default {
  name: 'CampgroundViewMap',
  props: {
    coordinates: String,
    campgroundName: String,
  },
  mounted: function() {
    return this.renderCampgroundMap();
  },
  methods: {
    renderCampgroundMap: function() {
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
        mapZoom = 10;
      }
      
      const map = new google.maps.Map(document.getElementById('campground-map'), {
        center: latLong,
        zoom: mapZoom,
        mapTypeId: 'terrain',
      });

      let address = this.campgroundName;
      let geocoder = new google.maps.Geocoder();

      geocoder.geocode({ 'address' : address }, (results, status) => {
        if (status === 'OK') {
          map.setCenter(results[0].geometry.location);
          const marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: this.campgroundName,
          });
        } else {
          const marker = new google.maps.Marker({
            map: map,
            position: latLong,
            title: this.parkName,
          });
        }
      })
    },
  }
}
</script>

<style lang="scss">
#campground-map {
  height: 200px;
  width: 100%;
}
</style>
