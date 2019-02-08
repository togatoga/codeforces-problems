import { combineReducers } from "redux";
import { RECEIVE_PROBLEMS } from "../actions/actions";

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

const rootReducer = combineReducers({
  problemsByApi
});

export default rootReducer;
