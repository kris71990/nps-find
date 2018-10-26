<template>
  <header class="header">
    <div id="header-img">
      <img src="../utils/bison.png">
    </div>
    <div id="header-nav">
      <h1>| Explore American Public Lands |</h1>
      <nav>
        <ul>
          <router-link to="/"><li v-on:click='resetDefault'>Home</li></router-link>
          <li><a href="#">Profile</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    resetDefault() { 
      this.$store.commit('setDefault');
    }
  }
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
    width: 88%;
    h1 {
      width: 45%;
      height: 100%;
      float: left;
      text-align: left;
      font-style: italic;
      padding-left: 5%;
      text-decoration: underline overline dotted #5E9B7E;
    }
    nav {
      width: 40%;
      height: 100%;
      float: left;
      text-align: right;
      font-style: italic;
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
