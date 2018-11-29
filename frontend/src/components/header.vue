<template>
  <header class="header">
    <div id="header-img">
      <router-link to="/">
        <img v-on:click='resetDefault' src="../utils/bison.png">
      </router-link>
    </div>
    <div id="header-nav">
      <router-link to="/"><h1 v-on:click='resetDefault'>Explore American Public Lands</h1></router-link>
      <nav>
        <ul>
          <router-link to="/">
            <li v-on:click='resetDefault'>Home</li>
          </router-link>
          <router-link v-if="this.loggedIn" to="/dashboard">
            <li>Dashboard</li>
          </router-link>
          <router-link v-if="this.loggedIn" to="/profile">
            <li>Profile</li>
          </router-link>
          <li><a href="#">About</a></li>
          <router-link v-if="this.loggedIn" to="/">
            <li v-on:click='handleLogout'>Logout</li>
          </router-link>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Header',
  methods: {
    resetDefault() { 
      this.$store.commit('setDefault');
    },
    handleLogout() {
      return this.$store.dispatch('logoutReq')
        .then(() => {
          Promise.resolve();
        });
    }
  },
  computed: mapState({
    loggedIn: state => state.authModule.loggedIn,
  })
}
</script>

<style lang="scss">
header {
  background-color: #336E55;
  color: #F1E3CB;
  border: 3px solid black;
  display: flex;
  flex-direction: row;
  align-items: center;
  #header-img {
    width: 10%;
    padding: 5px 20px 0px 20px;
    img {
      width: 100%;
      margin-bottom: 0;
    }
  }
  #header-nav {
    .icon-menu {
      visibility: hidden;
    }
    width: 88%;
    h1 {
      width: 42%;
      height: 100%;
      float: left;
      text-align: left;
      margin-left: 5%;
      padding-left: 1%;
      font-family: 'Rock Salt', cursive;
      color: #F1E3CB;
    }
    nav {
      width: 40%;
      height: 100%;
      float: left;
      text-align: right;
      padding-right: 8%;
      ul {
        padding-left: 0px;
        padding-top: 10%;
        li {
          display: inline;
          margin: 2%;
          list-style-type: none;
        }
        a {
          text-decoration: none;
          color: black;
          font-weight: bold;
        }
        a:hover {
          color: #F1E3CB;
        }
      }
    }
  }
}
</style>
