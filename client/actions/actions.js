import fetch from "cross-fetch";

export const REQUEST_PROBLEMS = "REQUEST_PROBLEMS";
export const RECEIVE_PROBLEMS = "RECEIVE_PROBLEMS";

function requestProblems() {
  return {
    type: REQUEST_PROBLEMS
  };
}

function receiveProblems(json) {
  return {
    type: RECEIVE_PROBLEMS,
    problems: json.problems
  };
}

export function fetchProblems() {
  return dispatch => {
    dispatch(requestProblems());
    return fetch("http://localhost:1323/v1/problems")
      .then(response => response.json())
      .then(json => dispatch(receiveProblems(json)));
  };
}
