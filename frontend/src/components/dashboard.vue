<template>
  <div>
    <div v-if="computedProfile">
      <h1>Search by...</h1>
      <div class="search-buttons">
        <p v-on:click="handleSearch">Geographic Region</p>
        <p v-if="computedProfile.favoredClimate">Climate</p>
        <p v-if="computedProfile.residentialLocaleType">Environment</p>
        <p v-if="computedProfile.favoredLandscape">Landscape</p>
        <p v-if="computedProfile.interests">Interests</p>
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
      const region = stateData[this.computedProfile.homeState].region;
      switch (event.target.textContent) {
        case 'Geographic Region':
          return this.$store.dispatch('getParksRegion', { 
            region, 
            state: this.computedProfile.homeState,
          })
            .then(() => {
              return this.$router.push(`/search/geographicregion`);
            });
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

