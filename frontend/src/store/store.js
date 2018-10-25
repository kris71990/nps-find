import Vue from 'vue';
import Vuex from 'vuex';
import superagent from 'superagent';

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
  },
  mutations: {
    changeState(state, selection) {
      state.stateAbbrev = selection.state;
      state.stateFull = selection.stateFull;
      state.interests = selection.interests;
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
    setPark(state, park) {
      state.singlePark = park;
      state.interests = null;
      state.parks = null;
      return state;
    },
    setTotal(state, total) {
      state.parksTotal = total;
      return state;
    },
    setTypes(state, types) {
      state.typesList = types;
      return state;
    }, 
    default(state) {
      state.stateAbbrev = null;
      state.stateFull = null;
      state.parksTotal = null;
      state.parks = null;
      state.stateList = null;
      state.typesList = null;
      state.interests = null;
      state.singlePark = null;
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
    foundParks(context, selections) {
      const { commit } = context;
      const { state, stateFull, interests } = selections;
      let parks;
      let parksNumber;
      return superagent.get(`${API_URL}/parks/${state}`)
        .query({ interests })
        .then((response) => {
          parks = response.body;
          parksNumber = response.body.length;
        })
        .then(() => {
          commit('changeState', { state, stateFull, interests });
          commit('foundParks', parks);
          commit('setTotal', parksNumber);
        });
    },
    setTypes(context) {
      const { commit } = context;
      let types;
      return superagent.get(`${API_URL}/states/types`)
        .then((response) => {
          types = response.body;
        })
        .then(() => {
          commit('setTypes', types);
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
    renderPark(context, park) {
      const { commit } = context;
      return commit('setPark', park);
    },
  },
});

export default store;
