<template>
  <div id="home">
    <div id="auth-box">
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
    <div id="selections-box">
      <div id="landing-form">
        <h3>Choose a state to find National Parks near you...</h3>
        <SearchForm :handleSearch="handleSearch"/>
      </div>
      <div v-on:click="handleQuickSearch" id="home-extras">
        <p>See an overview</p>
        <p>Most Popular</p>
        <p>Discover</p>
      </div>
    </div>
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
          return this.$router.push('/dashboard');
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
      return this.$store.dispatch('getParksInterest', { 
        state: this.state, 
        stateFull: this.stateFull, 
        interests: this.interests 
      })
        .then(() => {
          return this.$router.push({ 
            path: 'search', 
            query: { state: this.state, interests: this.interests }
          });
        });
    },

    handleQuickSearch(event, a) {
      console.log(event.target);
      if (event.target.localName === 'div') return;
      switch (event.target.textContent) {
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
        case 'See an overview':
          return this.$store.dispatch('stateChart')
            .then(() => {
              this.$router.push('/states');
            })
        default:
          return this.$router.push('/');
      }
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
  width: 100%;
  a {
    color: #336E55;
  }
  a:hover {
    color: #11C68A;
    text-decoration: underline;
    cursor: pointer;
  }
  #auth-box {
    .login-signup {
      width: 30%;
      margin: 2% auto;
      padding: 1%;
      background-color: #D0D2D3;
      border: 1px solid black;
    }
  }
  #selections-box {
    #landing-form {
      width: 40%;
      float: left;
      margin: 5%
    }
    #home-extras {
      width: 40%;
      float: left;
      margin: 5%;
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
        display: block;
      }
      p:hover {
        background-color: #336E55;
        color: #F1E3CB;
      }
    }
  }
}

@media only screen and (max-width: 900px) {
  #home {
    width: 60%;
    margin: 5% auto 12%;
  }
}

@media only screen and (max-width: 700px) {
  #home {
    width: 75%;
    margin: 5% auto 15%;
  }
}

@media only screen and (max-width: 500px) {
  #home {
    width: 90%;
    margin: 5% auto 18%;
  }
}
</style>
