import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stateSelection: null,
  },
  mutations: {
    increment(state, selection) {
      state.stateSelection = selection;
      return state;
    },
  },
});

export default store;
