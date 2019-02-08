import { combineReducers } from "redux";
import { REQUEST_PROBLEMS, RECEIVE_PROBLEMS } from "../actions/actions";

function problemsByApi(state = {}, action) {
  switch (action.type) {
    case RECEIVE_PROBLEMS:
      return Object.assign({}, state, {
        problems: action.problems
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  problemsByApi
});

export default rootReducer;
