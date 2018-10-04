import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stateSelection: null,
    parks: null,
  },
  mutations: {
    changeState(state, selection) {
      state.stateSelection = selection;
      return state;
    },
    foundParks(state, fromApi) {
      state.parks = fromApi;
      return state;
    },
    default(state) {
      state.stateSelection = null;
      state.parks = null;
      return state;
    },
  },
  getters: {
    getState: (state) => {
      return state.stateSelection;
    },
    getParks: (state) => {
      return state.parks;
    },
  },
});

export default store;
