import superagent from 'superagent';

const profileModule = {
  state: {
    profile: null,
  },
  mutations: {
    setProfile: (state, profileSet) => {
      if (!profileSet) return state;
      const { profile, reports } = profileSet;
      if (reports) {
        profile.reports = reports;
      }
      state.profile = profile;
      return state;
    },
  },
  actions: {
    createProfileReq: (context, profile) => {
      const { commit, rootState } = context;
    
      return superagent.post(`${API_URL}/profile`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .set('Content-Type', 'application/json')
        .send(profile)
        .then((response) => {
          return commit('setProfile', response.body);
        });
    },
    
    updateProfileReq: (context, profile) => {
      const { commit, state, rootState } = context;
    
      return superagent.put(`${API_URL}/profile/${state.profile.id}`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .set('Content-Type', 'application/json')
        .send(profile)
        .then((response) => {
          return commit('setProfile', response.body[0]);
        });
    },
    
    fetchProfileReq: (context) => {
      const { commit, rootState } = context;
    
      return superagent.get(`${API_URL}/profile/me`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .then((response) => {
          return commit('setProfile', response.body);
        });
    },
  },
};

export default profileModule;
