<template>
  <div>
    <div v-if="computedProfile">
      <h1>Search by...</h1>
      <div v-on:click="handleSearch" class="search-buttons">
        <div class="user-buttons">
          <p>Geographic Region</p>
          <p v-if="computedProfile.favoredClimate">Climate</p>
          <p v-if="computedProfile.residentialLocaleType">Environment</p>
          <p v-if="computedProfile.favoredLandscape">Landscape</p>
          <p v-if="computedProfile.interests">Interests</p>
        </div>
        <div class="common-buttons">
          <p>Overview</p>
          <p>Most Popular</p>
          <p>Discover</p>
        </div>
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
          return this.$store.dispatch('getParksUserPrefs', {
            prefs: climate,
            type: 'climate',
          })
            .then(() => {
              return this.$router.push(`/search/climate`);
            })
        case 'Environment':
          const environment = this.computedProfile.residentialLocaleType;
          return this.$store.dispatch('getParksUserPrefs', {
            prefs: environment,
            type: 'environment',
          })
            .then(() => {
              return this.$router.push('/search/environment');
            })
        case 'Landscape':
          const landscape = this.computedProfile.favoredLandscape;
          return this.$store.dispatch('getParksUserPrefs', {
            prefs: landscape,
            type: 'landscape',
          })
            .then(() => {
              return this.$router.push('/search/landscape');
            })
        case 'Interests':
          const interests = this.computedProfile.interests;
          const stateProfile = this.computedProfile.homeState;
          const interestsArr = this.computedProfile.interests.split(',');
          return this.$store.dispatch('getParksInterest', {
            state: stateProfile, 
            stateFull: stateData[this.computedProfile.homeState].fullName, 
            interests: this.computedProfile.interests.split(','), 
          })
            .then(() => {
              return this.$router.push({
                path: 'search', 
                query: { state: stateProfile, interests: interestsArr }
              })
            })
        case 'Most Popular':
          return this.$store.dispatch('getTopParks', 'top')
            .then(() => {
              return this.$router.push('/search/popular');
            })
        case 'Discover':
          return this.$store.dispatch('getRandomParks', 'random')
            .then(() => {
              return this.$router.push('/search/random');
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
    margin: 3%;
    padding: 0.6% 1%;
    cursor: pointer;
    display: inline-block;
  }
  .common-buttons {
    p {
      border-radius: 2px;
      background-color: #82BAA7;
      border: 2px solid #269693;
      margin-bottom: 5%;
    }
    p:hover {
      background-color: #00716F;
      color: #F1E3CB;
    }
  }
  .user-buttons {
    p {
      background-color: #96AFA7;
      border-radius: 5px;
      border: 2px solid #4A8571;
    }
    p:hover {
      background-color: #336E55;
      color: #F1E3CB;
    }
  }
}

@media only screen and (max-width: 900px) {
  .search-buttons {
    width: 90%;
    margin: 0 auto;
    p {
      width: 30%;
      margin: 4% auto;
      padding: 1%;
    }
  }
}

@media only screen and (max-width: 600px) {
  .search-buttons {
    width: 90%;
    margin: 5% auto 20%;
    p {
      width: 60%;
      display: block;
      margin: 8% auto;
      padding: 2%;
    }
    .common-buttons {
      border-top: 2px dashed black;
    }
  }
}
</style>

