<template>
  <footer class="footer">
    <p>&copy; {{new Date().getFullYear()}} - Kris</p>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss">
footer {
  background-color: #336E55;
  color: #F1E3CB;
  border: 2px solid black;
}
</style>