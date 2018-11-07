import Vue from 'vue';
import Vuex from 'vuex';

import authModule from './modules/auth';
import profileModule from './modules/profile';
import stateModule from './modules/state';
import parkModule from './modules/park';
import campgroundModule from './modules/campground';
import setDefault from './mutations';

Vue.use(Vuex);

const store = new Vuex.Store({
  getters: {
    getState: (state) => {
      return state.stateSelection;
    },
    getParks: (state) => {
      return state.parks;
    },
  },
  modules: {
    authModule,
    profileModule,
    stateModule,
    parkModule,
    campgroundModule,
  },
  mutations: {
    setDefault,
  },
});

export default store;
