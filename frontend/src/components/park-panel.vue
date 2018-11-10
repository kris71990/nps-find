<template>
  <div class="park-panel">
    <div class="interests">
      <h4>You are interested in...</h4>
      <ul>
        <li v-for="interest in interests" :key="interest">
          {{ interest }}
        </li>
      </ul>
    </div>
    <div class="panel">
      <h4>{{ total }} locations found.</h4>
      <p 
        v-if="interests.includes('camping') && parks.length > 0"
        v-on:click="renderCampgrounds(state)"
      >
      Or see all campgrounds in the state.
      </p>
      <ul>
        <li v-for="park in parks" :key="park.parkCode">
          <div v-on:click="renderPark(park)" class="park-card">
            <p><a>{{ park.fullName }}</a></p>
            <img v-bind:src="randomizedImage(park)"/>
          </div>
          <p>- {{ createReportBlurb(park.reports) }} -</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParkPanel',
  props: {
    parks: Array,
    interests: Array,
    total: Number,
    state: String,
  },
  methods: {
    randomizedImage: function (park) {
        const arr = park.imageUrl.split('\n');
        arr.pop();
        const index = Math.round(Math.random() * (arr.length - 1));
        return arr[index];
      }, 
    renderPark: function (park) {
        return this.$store.dispatch('renderPark', park)
          .then(() => {
            this.$router.push(`/park/${park.parkCode}`);
          })
      },
    renderCampgrounds: function (state) {
        return this.$store.dispatch('renderCampgroundsState', state)
          .then(() => {
            this.$router.push(`/campgrounds/${state}`);
          })
      },
    createReportBlurb: function(reports) {
      return reports ? reports > 1 ? `${reports} reports` : `${reports} report` : 'No reports - submit the first!';
    }
  }
}
</script>

<style lang="scss">
.interests {
  width: 30%;
  margin: 0 auto;
  padding: 1%;
  background-color: #E8EAEB;
  border: 5px dashed grey;
  h4 {
    margin: 1%;
  }
  ul {
    width: 30%;
    padding-left: 0;
    margin: 0 auto;
    li {
      text-align: left;
      padding-left: 10%;
      list-style-position: inside;
      list-style-type: circle;
    }
  }
}
.panel {
  margin-bottom: 5%;
  ul {
    padding-left: 0;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;
    li {
      margin: 2% 2% 3% 2%;
      width: 25%;
      list-style-type: none;
      .park-card {
        font-weight: bold;
        font-style: oblique;
        height: 100%;
        border: 8px double #0870B8;
        background-color: #ECF2FF;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
    .park-card:hover {
      border: 8px solid #930000;
      transform: scale(1.01,1.01);
      cursor: pointer;
    }
  }
}
</style>
