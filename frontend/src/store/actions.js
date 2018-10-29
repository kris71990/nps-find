import superagent from 'superagent';

const foundParks = (context, selections) => {
  const { commit } = context;
  const { state, stateFull, interests } = selections;
  let parks;
  let parksNumber;
  return superagent.get(`${API_URL}/parks/${state}`)
    .query({ interests })
    .then((response) => {
      let parkTypes;
      if (response.body) parkTypes = response.body;
      return superagent.put(`${API_URL}/parks/${state}`)
        .send({ parkTypes })
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
};

const getCampgrounds = (context, park) => {
  const { commit } = context;
  const { pKeyCode } = park;
  return superagent.get(`${API_URL}/campgrounds/${pKeyCode}`)
    .then((response) => {
      console.log(response);
    });
};

const setTypes = (context) => {
  const { commit } = context;
  let types;
  return superagent.get(`${API_URL}/states/types`)
    .then((response) => {
      types = response.body;
    })
    .then(() => {
      commit('setTypes', types);
    });
};

const stateChart = (context) => {
  const { commit } = context;
  let parks;
  return superagent.get(`${API_URL}/states`)
    .then((response) => {
      parks = response.body;
    })
    .then(() => {
      commit('createStateList', parks);
    });
};

const renderPark = (context, park) => {
  const { commit } = context;
  return commit('setPark', park);
};

export {
  foundParks, renderPark, setTypes, stateChart, getCampgrounds,
};
