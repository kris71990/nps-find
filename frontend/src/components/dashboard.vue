<template>
  <div>
    <div v-if="computedProfile">
      <h1>Search by...</h1>
      <div v-on:click="handleSearch" class="search-buttons">
        <p>Geographic Region</p>
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
      if (event.target.localName === 'div') return;
      switch (event.target.textContent) {
        case 'Geographic Region':
          const region = stateData[this.computedProfile.homeState].region;
          return this.$store.dispatch('getParksRegion', region)
            .then(() => {
              return this.$router.push(`/search/geographicregion`);
            });
        case 'Climate':
          const climate = this.computedProfile.favoredClimate;
          return this.$store.dispatch('getParksClimate', climate)
            .then(() => {
              return this.$router.push(`/search/climate`);
            })
        default:
          return this.$router.push('/dashboard');
      }
    },
  }
}
</script>

<style lang="scss">
.search-buttons {
  p {
    min-width: 10%;
    margin: 2%;
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

@media only screen and (max-width: 600px) {
  .search-buttons {
    p {
      width: 60%;
      display: block;
      margin: 5% auto;
    }
  }
}
</style>

