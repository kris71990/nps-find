<template>
  <header class="header">
    <h1>Explore American Public Lands</h1>
    <nav>
      <ul>
        <router-link to="/"><li v-on:click='resetDefault'>Home</li></router-link>
        <li><a href="#">Profile</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
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
  border: 2px solid black;
  a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }
  a:hover {
    color: #F1E3CB;
  }
  ul {
    padding-left: 0px;
    li {
      display: inline;
      margin: 2%;
      list-style-type: none;
    }
  }
}
</style>
