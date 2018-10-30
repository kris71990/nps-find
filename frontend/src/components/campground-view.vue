<template>
  <div>
    <h1>{{ campground.name }}</h1>
    <h4>Type: <span>{{ campground.accessibility.classifications[0] }}</span></h4>
    <h4>Access: <span>{{ campground.accessibility.accessRoads[0] }}</span></h4>
    <h3>About...</h3>
    <p>{{ campground.description }}</p>
    <h3>How to get here...</h3>
    <p>{{ campground.directionsOverview }}</p>
    <h3>Campsite breakdown...</h3>
    <ul>
      <li v-for="(type, index) in orderCampsiteTypes()" :key="index">
        {{ formatType(type) }} - {{ campground.campsites[type] }}
      </li> 
    </ul>
    <h3>Amenities...</h3>
    <ul>
      <li v-for="(type, index) in Object.keys(campground.amenities)" :key="index">
        {{ type }} - {{ campground.amenities[type] ? formatAmenities(type) : 'None' }}
      </li> 
    </ul>
    <h3>Accessibility...</h3>
    <ul>
      <li v-for="(type, index) in Object.keys(campground.accessibility)" :key="index">
        {{ formatAccessibility(type) }}
      </li> 
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CampgroundView',
  props: {
    campground: Object,
  },
  methods: {
    orderCampsiteTypes: function () {
      const types = Object.keys(this.campground.campsites);
      const sorted = types.sort((a, b) => {
        return this.campground.campsites[b] - this.campground.campsites[a];
      });
      return sorted;
    },
    formatType: function(type) {
      return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
    },
    formatAmenities: function(type) {
      let amenities = '';
      if (this.campground.amenities[type] instanceof(Array)) {
        this.campground.amenities[type].forEach((i) => {
          amenities += i;
        });
      } else {
        amenities = this.campground.amenities[type];
      }
      return amenities;
    },
    formatAccessibility: function(type) {
      return `${type} - ${this.campground.accessibility[type]}`;
    },
  },
}
</script>

<style lang="scss">

</style>
