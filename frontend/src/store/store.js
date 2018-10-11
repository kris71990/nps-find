import Vue from 'vue';
import Vuex from 'vuex';
import superagent from 'superagent';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stateAbbrev: null,
    stateFull: null,
    parksTotal: null,
    parks: null,
    stateList: null,
  },
  mutations: {
    changeState(state, selection) {
      state.stateAbbrev = selection.state;
      state.stateFull = selection.stateFull;
      return state;
    },
    foundParks(state, fromApi) {
      state.parks = fromApi;
      state.stateList = null;
      return state;
    },
    createStateList(state, statesFromDB) {
      state.stateList = statesFromDB;
    },
    setTotal(state, total) {
      state.parksTotal = total;
      return state;
    },
    default(state) {
      state.stateAbbrev = null;
      state.stateFull = null;
      state.parksTotal = null;
      state.parks = null;
      state.stateList = null;
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
  actions: {
    foundParks(context, stateSelection) {
      const { commit } = context;
      const { state, stateFull } = stateSelection;
      let parks;
      let parksNumber;
      return superagent.get(`${API_URL}/parks/${state}`)
        .then((response) => {
          parks = response.body;
          parksNumber = response.body.length;
        })
        .then(() => {
          commit('changeState', { state, stateFull });
          commit('foundParks', parks);
          commit('setTotal', parksNumber);
        });
    },
    stateChart(context) {
      const { commit } = context;
      let parks;
      return superagent.get(`${API_URL}/states`)
        .then((response) => {
          parks = response.body;
        })
        .then(() => {
          commit('createStateList', parks);
        });
    },
  },
});

export default store;
