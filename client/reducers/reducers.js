import { combineReducers } from "redux";
import { RECEIVE_PROBLEMS, RECEIVE_SUBMISSIONS } from "../actions/actions";

function problemsByApi(state = { problems: [] }, action) {
  switch (action.type) {
    case RECEIVE_PROBLEMS:
      return Object.assign({}, state, {
        problems: action.problems
      });
    default:
      return state;
  }
}

function usersByApi(state = { user: [], rivals: [] }, action) {
  switch (action.type) {
    case RECEIVE_SUBMISSIONS:
      return Object.assign({}, state, {
        user: action.user,
        rivals: action.rivals
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  problemsByApi,
  usersByApi
});

export default rootReducer;
