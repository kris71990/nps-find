import superagent from 'superagent';

const campgroundModule = {
  state: {
    campgrounds: null,
  },
  mutations: {
    setCampgrounds: (state, campgrounds) => {
      state.campgrounds = campgrounds;
      return state;
    },
  },
  actions: {
    getCampgrounds: (context, park) => {
      const { commit } = context;
      const { pKeyCode } = park;
      return superagent.get(`${API_URL}/campgrounds/park/${pKeyCode}`)
        .then((response) => {
          commit('setCampgrounds', response.body);
        });
    },
    
    renderCampgroundsState: (context, state) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/campgrounds/${state}`)
        .then((response) => {
          commit('setCampgrounds', response.body);
        });
    },
  },
};

export default campgroundModule;
