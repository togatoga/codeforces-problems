import { combineReducers } from "redux";
import {
  RECEIVE_PROBLEMS,
  RECEIVE_USERS,
  REQUEST_USERS
} from "../actions/actions";

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

function usersByApi(state = { user: {}, rivals: {} }, action) {
  switch (action.type) {
    case RECEIVE_USERS:
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
