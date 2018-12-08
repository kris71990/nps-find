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
    getParksInterest: (context, selections) => {
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
              commit('foundParks', parks);
              commit('setTotal', parksNumber);
              commit('changeState', { 
                searchParam: state,
                stateFull,
                type: 'state',
                interests,
              });
            });
        });
    },

    getTopParks: (context, order) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/all/top`)
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', { 
            searchParam: order, 
            type: 'top', 
            interests: [],
          });
        });
    },

    getRandomParks: (context, order) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/parks/all/random`)
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', { 
            searchParam: order, 
            type: 'random', 
            interests: [],
          });
        });
    },

    getParksRegion: (context, region) => {
      const { commit, rootState } = context;
      return superagent.get(`${API_URL}/parks/region/${region}`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
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

    getParksUserPrefs: (context, userPrefs) => {
      const { commit, rootState } = context;
      const { prefs, type } = userPrefs;
      return superagent.get(`${API_URL}/parks/userprefs/all`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .query({ [type]: prefs })
        .then((response) => {
          commit('foundParks', response.body);
          commit('setTotal', response.body.length);
          commit('changeState', { 
            searchParam: prefs, 
            type,
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
