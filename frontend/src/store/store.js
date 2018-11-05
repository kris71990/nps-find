import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';
import { fetchCookie } from '../utils/cookie';

Vue.use(Vuex);

const token = fetchCookie('nps-token');
const tokenState = token || null;
const loggedInState = token ? true : false;

const store = new Vuex.Store({
  state: {
    token: tokenState,
    loggedIn: loggedInState,
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
