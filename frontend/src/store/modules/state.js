import superagent from 'superagent';

const stateModule = {
  state: {
    typesList: null,
    stateList: null,
  },
  mutations: {
    setTypes: (state, types) => {
      state.typesList = types;
      return state;
    },

    createStateList: (state, statesFromDB) => {
      state.stateList = statesFromDB;
      return state;
    },
  },
  actions: {
    setTypes: (context) => {
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
    
    stateChart: (context) => {
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
};

export default stateModule;
