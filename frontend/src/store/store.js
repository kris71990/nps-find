import Vue from 'vue';
import Vuex from 'vuex';
import superagent from 'superagent';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    stateAbbrev: null,
    stateFull: null,
    parks: null,
  },
  mutations: {
    changeState(state, selection) {
      state.stateAbbrev = selection.state;
      state.stateFull = selection.stateFull;
      return state;
    },
    foundParks(state, fromApi) {
      state.parks = fromApi;
      return state;
    },
    default(state) {
      state.stateAbbrev = null;
      state.stateFull = null;
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
  actions: {
    foundParks(context, stateSelection) {
      const { commit } = context;
      const { state, stateFull } = stateSelection;
      let parks;
      return superagent.get(`${API_URL}/state/${state}`)
        .then((response) => {
          parks = response.body;
        })
        .then(() => {
          commit('changeState', { state, stateFull });
          commit('foundParks', parks);
        });
    },
  },
});

export default store;
