import superagent from 'superagent';

const reportModule = {
  state: {
    singleParkReports: null,
  },
  mutations: {
    setReports: (state, reports) => {
      state.singleParkReports = reports;
      return state;
    },
  },
  actions: {
    fetchReportReq: (context, parkCode) => {
      const { commit, rootState } = context;
    
      return superagent.get(`${API_URL}/report/park/${parkCode}`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .then((response) => {
          return commit('setReports', response.body);
        });
    },
  },
};

export default reportModule;
