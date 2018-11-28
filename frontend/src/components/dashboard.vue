<template>
  <div>
    <div v-if="computedProfile">
      <h1>Search by...</h1>
      <div class="search-buttons">
        <p v-on:click="handleSearch" >Geographic Region</p>
        <p v-if="computedProfile.favoredClimate" v-on:click="handleSearch">Climate</p>
        <p v-if="computedProfile.residentialLocaleType" v-on:click="handleSearch">Environment</p>
        <p v-if="computedProfile.favoredLandscape" v-on:click="handleSearch">Landscape</p>
        <p v-if="computedProfile.interests" v-on:click="handleSearch">Interests</p>
      </div>  
    </div>
    <div v-else>
      <router-link to="/profile">Create a profile</router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { stateData } from '../utils/states';

export default {
  name: 'Dashboard',
  computed: mapState({
    computedProfile: state => state.profileModule.profile,
  }),
  methods: {
    handleSearch(event, a) {
      console.log(event.target.textContent);
      switch (event.target.textContent) {
        case 'Geographic Region':
          const region = stateData[this.computedProfile.homeState].region;
          return this.$store.dispatch('getParksRegion', { 
            region, 
            state: this.computedProfile.homeState,
          })
            .then(() => {
              return this.$router.push(`/search/geographicregion`);
            });
        case 'Climate':
          const climate = this.computedProfile.favoredClimate;
          return this.$store.dispatch('getParksClimate', {
            climate,
            state: this.computedProfile.homeState,
          })
            .then(() => {
              return this.$router.push(`/search/climate`);
            })
        default:
          return this.$router.push('/dashboard');
      }
      // return this.$store.dispatch('foundParks', { state: this.state, stateFull: this.stateFull, interests: this.interests })
      //   .then(() => {
      //     this.$router.push(`/search?state=${this.state}&interests=${this.interests}`);
      //   });
    },
  }
}
</script>

<style lang="scss">
.search-buttons {
  p {
    min-width: 10%;
    margin: 3%;
    padding: 0.6% 1%;
    background-color: #96AFA7;
    border-radius: 5px;
    border: 2px solid #4A8571;
    cursor: pointer;
    text-decoration: none;
    color: black;
    display: inline-block;
  }
  p:hover {
    background-color: #336E55;
    color: #F1E3CB;
  }
}
</style>

