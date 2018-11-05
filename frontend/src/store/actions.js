import superagent from 'superagent';
import { deleteCookie } from '../utils/cookie';

const signupReq = (context, user) => {
  const { commit } = context;
  return superagent.post(`${API_URL}/signup`)
    .send(user)
    .withCredentials()
    .then((response) => {
      commit('setToken', response.text);
    });
};

const loginReq = (context, user) => {
  const { commit } = context;
  return superagent.get(`${API_URL}/login`)
    .auth(user.username, user.password)
    .withCredentials()
    .then((response) => {
      commit('setToken', response.text);
    });
};

const logoutReq = (context) => {
  const { commit } = context;
  deleteCookie('nps-token');
  commit('removeToken');
};

const foundParks = (context, selections) => {
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
};

const getCampgrounds = (context, park) => {
  const { commit } = context;
  const { pKeyCode } = park;
  return superagent.get(`${API_URL}/campgrounds/park/${pKeyCode}`)
    .then((response) => {
      commit('setCampgrounds', response.body);
    });
};

const renderCampgroundsState = (context, state) => {
  const { commit } = context;
  return superagent.get(`${API_URL}/campgrounds/${state}`)
    .then((response) => {
      commit('setCampgrounds', response.body);
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
  signupReq,
  loginReq,
  logoutReq,
  foundParks, 
  renderPark, 
  setTypes, 
  stateChart, 
  getCampgrounds, 
  renderCampgroundsState,
};
