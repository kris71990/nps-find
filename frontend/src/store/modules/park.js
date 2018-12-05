import superagent from 'superagent';

const parkModule = {
  state: {
    searchParam: null,
    type: null,
    stateAbbrev: null,
    stateFull: null,
    interests: null,
    parks: null,
    stateList: null,
    parksTotal: null,
    singlePark: null,
  },
  mutations: {
    changeState: (state, selection) => {
      state.stateAbbrev = selection.state;
      state.stateFull = selection.stateFull;
      state.interests = selection.interests;
      if (selection.state) {
        state.searchParam = selection.state;
        state.type = 'state';
      } else {
        state.searchParam = selection.searchParam;
        state.type = selection.type;
      }
      return state;
    }, 
    
    foundParks: (state, fromApi) => {
      state.parks = fromApi;
      state.stateList = null;
      return state;
    },

    setTotal: (state, total) => {
      state.parksTotal = total;
      return state;
    },

    setPark: (state, park) => {
      state.singlePark = park;
      return state;
    },
  },
  actions: {
    foundParks: (context, selections) => {
      const { commit } = context;
      const { state, stateFull, interests } = selections;
      let parks;
      let parksNumber;
      return superagent.get(`${API_URL}/parks/${state}`)
        .query({ interests })
        .then((response) => {
          let customParks;
          if (response.body) customParks = response.body;
          return superagent.put(`${API_URL}/parks/${state}`)
            .send(customParks)
            .then((updatedResponse) => {
              parks = updatedResponse.body;
              parksNumber = updatedResponse.body.length;
            })
            .then(() => {
              commit('changeState', { state, stateFull, interests });
              commit('foundParks', parks);
              commit('setTotal', parksNumber);
            });
        });
    },

    getParksRegion: (context, region) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/region/${region}`)
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', { 
            searchParam: region, 
            type: 'region', 
            interests: [],
          });
        });
    },

    getParksClimate: (context, climate) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/weather/all`)
        .query({ climate })
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', { 
            searchParam: climate, 
            type: 'climate',
            interests: [],
          });
        });
    },

    getParksEnvironment: (context, environment) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/environment/all`)
        .query({ environment })
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', {
            searchParam: environment,
            type: 'environment',
            interests: [],
          });
        });
    },

    getParksLandscape: (context, landscape) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/landscape/all`)
        .query({ landscape })
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', {
            searchParam: landscape,
            type: 'landscape',
            interests: [],
          });
        });
    },

    getSinglePark: (context, pKeyCode) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/park/${pKeyCode}`)
        .then((park) => {
          return commit('setPark', park.body);
        });
    },

    renderPark: (context, park) => {
      const { commit } = context;
      return commit('setPark', park);
    },
  },
};

export default parkModule;
