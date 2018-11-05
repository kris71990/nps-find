<template>
  <div id="home">
    <div>
      <div v-if="!loggedIn">
        <router-link to="/login">Login</router-link> 
        or 
        <router-link to="/signup">Signup</router-link>
      </div>
      <div v-else>
        <AuthForm 
          v-bind:type="this.$route === '/login' ? 'Login' : 'Signup'"
          v-bind:onComplete="this.$route === '/login' ? handleLogin : handleSignup"
        />
      </div>
    </div>
    <h3>Choose a state to find National Parks near you...</h3>
    <h4>Or see an <a v-on:click="getStateList">overview</a> of all parks</h4>
    <SearchForm :handleSearch="handleSearch"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AuthForm from './auth-form.vue';
import SearchForm from './search-form.vue';

export default {
  name: 'Landing',
  components: {
    SearchForm,
  },
  data() {
    return {
      parks: null,
      state: null,
      stateFull: null,
      interests: null,
    }
  },
  methods: {
    handleLogin() {

    },
    handleSignup() {

    },
    handleSearch(event, a, b, c) {
      this.state = event.state;
      this.stateFull = event.stateFull;
      this.interests = event.interests;
      return this.$store.dispatch('foundParks', { state: this.state, stateFull: this.stateFull, interests: this.interests })
        .then(() => {
          this.$router.push('/dashboard');
        });
    },
    getStateList(event, a, b) {
      return this.$store.dispatch('stateChart')
        .then(() => {
          this.$router.push('/states');
        })
    }
  },
  computed: mapState({
    computedParks: state => state.parks,
    stateList: state => state.stateList,
    singlePark: state => state.singlePark,
    loggedIn: state => state.loggedIn,
  }),
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
  a {
    color: #336E55;
  }
  a:hover {
    color: #11C68A;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
