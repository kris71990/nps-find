import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stateAbbrev: null,
    stateFull: null,
    interests: null,
    parksTotal: null,
    parks: null,
    stateList: null,
    typesList: null,
    singlePark: null,
    campgrounds: null,
  },
  getters: {
    getState: (state) => {
      return state.stateSelection;
    },
    getParks: (state) => {
      return state.parks;
    },
  },
  mutations,
  actions,
});

export default store;
