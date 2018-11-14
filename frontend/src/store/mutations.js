export default (state) => {
  state.parkModule.stateAbbrev = null;
  state.parkModule.stateFull = null;
  state.parkModule.parksTotal = null;
  state.parkModule.parks = null;
  state.stateModule.stateList = null;
  state.stateModule.typesList = null;
  state.parkModule.interests = null;
  state.campgroundModule.campgrounds = null;
  state.parkModule.singlePark = null;
  state.reportModule.singleParkReports = null;
  return state;
};
