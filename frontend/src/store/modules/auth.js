import superagent from 'superagent';
import { fetchCookie, deleteCookie } from '../../utils/cookie';

const token = fetchCookie('nps-token');
const tokenState = token || null;
const loggedInState = token ? true : false;

const authModule = {
  state: {
    token: tokenState,
    loggedIn: loggedInState,
  },
  mutations: {
    setToken: (state, setToken) => {
      state.token = setToken;
      state.loggedIn = true;
      return state;
    },
    removeToken: (state) => {
      state.token = null;
      state.loggedIn = false;
      return state;
    },
  },
  actions: {
    signupReq: (context, user) => {
      const { commit } = context;
      return superagent.post(`${API_URL}/signup`)
        .send(user)
        .withCredentials()
        .then((response) => {
          commit('setToken', response.body.token);
        });
    },
    
    loginReq: (context, user) => {
      const { commit } = context;
      return superagent.get(`${API_URL}/login`)
        .auth(user.username, user.password)
        .withCredentials()
        .then((response) => {
          commit('setToken', response.body.token);
        });
    },
    
    logoutReq: (context) => {
      const { commit } = context;
      deleteCookie('nps-token');
      return commit('removeToken');
    },
  }, 
};

export default authModule;
