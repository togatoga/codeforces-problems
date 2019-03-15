import { combineReducers } from "redux";
import {
  RECEIVE_PROBLEMS,
  RECEIVE_SUBMISSIONS,
  RECEIVE_CONTESTS,
  RECEIVE_FILTERS,
  RECEIVE_VISIBILITY
} from "../actions/actions";
import { defaultCipherList } from "constants";

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
    filters: {
      statuses: [],
      solvedCount: 0,
      tags: ["dp", "math"],
      selectedTags: []
    }
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
function visibilityByUser(
  state = {
    visibility: {
      solvedCount: false,
      tags: false
    }
  },
  action
) {
  switch (action.type) {
    case RECEIVE_VISIBILITY:
      return Object.assign({}, state, {
        visibility: action.visibility
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  problemsByApi,
  usersByApi,
  contestsByApi,
  filtersByUser,
  visibilityByUser
});

export default rootReducer;
