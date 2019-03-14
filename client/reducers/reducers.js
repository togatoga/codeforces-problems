import { combineReducers } from "redux";
import {
  RECEIVE_PROBLEMS,
  RECEIVE_SUBMISSIONS,
  RECEIVE_CONTESTS,
  RECEIVE_FILTERS
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

function contestsByApi(state = { contests: [] }, action) {
  switch (action.type) {
    case RECEIVE_CONTESTS:
      return Object.assign({}, state, {
        contests: action.contests
      });
    default:
      return state;
  }
}

function filtersByUser(
  state = {
    filters: []
  },
  action
) {
  switch (action.type) {
    case RECEIVE_FILTERS:
      return Object.assign({}, state, {
        filters: action.filters
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  problemsByApi,
  usersByApi,
  contestsByApi,
  filtersByUser
});

export default rootReducer;
