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
    postReportReq: (context, reportData) => {
      const { commit, rootState } = context;
    
      return superagent.post(`${API_URL}/report`)
        .set('Authorization', `Bearer ${rootState.authModule.token}`)
        .set('Content-Type', 'application/json')
        .send(reportData)
        .then(() => {
          return superagent.get(`${API_URL}/report/park/${reportData.parkId}`)
            .set('Authorization', `Bearer ${rootState.authModule.token}`)
            .then((response) => {
              return commit('setReports', response.body);
            });
        });
    },
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
