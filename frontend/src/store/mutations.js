const changeState = (state, selection) => {
  state.stateAbbrev = selection.state;
  state.stateFull = selection.stateFull;
  state.interests = selection.interests;
  return state;
};

const foundParks = (state, fromApi) => {
  state.parks = fromApi;
  state.stateList = null;
  return state;
};

const createStateList = (state, statesFromDB) => {
  state.stateList = statesFromDB;
  return state;
};

const setPark = (state, park) => {
  state.singlePark = park;
  return state;
};

const setCampgrounds = (state, campgrounds) => {
  state.campgrounds = campgrounds;
  return state;
};

const setTotal = (state, total) => {
  state.parksTotal = total;
  return state;
};

const setTypes = (state, types) => {
  state.typesList = types;
  return state;
};

const setDefault = (state) => {
  state.stateAbbrev = null;
  state.stateFull = null;
  state.parksTotal = null;
  state.parks = null;
  state.stateList = null;
  state.typesList = null;
  state.interests = null;
  state.campgrounds = null;
  state.singlePark = null;
  return state;
};

export {
  changeState, 
  foundParks, 
  createStateList, 
  setPark, 
  setTotal, 
  setTypes, 
  setDefault,
  setCampgrounds,
};
