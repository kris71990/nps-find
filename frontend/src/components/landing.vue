<template>
  <div id="home">
    <div>
      <div class="login-signup" v-if="!loggedIn">
        <router-link to="/login">Login</router-link> 
        or 
        <router-link to="/signup">Signup</router-link>
      </div>
      <div class="login-signup" v-if="loggedIn && !profile">
        <p>Create your <router-link to="/profile">profile!</router-link></p>
      </div>
      <div v-if="this.$route.path === '/login' || this.$route.path === '/signup'">
        <AuthForm 
          v-bind:type="this.$route.path === '/login' ? 'Login' : 'Signup'"
          v-bind:onComplete="this.$route.path === '/login' ? handleLogin : handleSignup"
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
    AuthForm,
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
    handleLogin(event, a) {
      return this.$store.dispatch('loginReq', event)
        .then(() => {
          this.$store.dispatch('fetchProfileReq');
          return this.$router.push('/');
        })
    },
    handleSignup(event) {
      return this.$store.dispatch('signupReq', event)
        .then(() => {
          return this.$router.push('/');
        })
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
    computedParks: state => state.parkModule.parks,
    stateList: state => state.stateModule.stateList,
    singlePark: state => state.parkModule.singlePark,
    loggedIn: state => state.authModule.token,
    profile: state => state.profileModule.profile,
  }),
}
</script>

<style lang="scss">
#home {
  width: 40%;
  margin: 5% auto;
  .login-signup {
    width: 60%;
    margin: 0 auto;
    padding: 2%;
    background-color: #D0D2D3;
    border: 1px solid black;
  }
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
