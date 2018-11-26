<template>
  <div>
    <h1>Search by...</h1>
    <div class="search-buttons">
      <p>Geographic Region</p>
      <p v-if="computedProfile.favoredClimate">Climate</p>
      <p v-if="computedProfile.residentialLocaleType">Environment</p>
      <p v-if="computedProfile.favoredLandscape">Landscape</p>
      <p v-if="computedProfile.interests">Interests</p>
    </div>  
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Dashboard',
  computed: mapState({
    computedProfile: state => state.profileModule.profile,
  }),
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

