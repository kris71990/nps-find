<template>
  <div v-if="computedStateList" id="state-rankings">
    <h2>National Parks by State</h2>
    <ul>
      <li v-for="(state, index) in computedStateList" :key="state.stateId">
        {{ index + 1 }}.
        {{ fullStateNames[state.stateId] }} - 
        {{ state.total }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { stateAbbreviations } from '../utils/states';

export default {
  name: 'StateRankings',
  data() {
    return {
      fullStateNames: stateAbbreviations,
    }
  },
  computed:
    mapState({
      computedStateList: state => state.stateList,
    }),  
}
</script>

<style lang="scss">
#state-rankings {
  width: 95%;
  margin: 0 auto;
  ul {
    padding-left: 0px;
    li {
      margin: 1%;
      list-style-type: none;
    }
  }
}
</style>
