<template>
  <div class="single-park">
    <h3>Park View</h3>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ParkView',
  computed: mapState({
    computedPark: state => state.singlePark,
  })
}
</script>

<style lang="scss">

</style>
