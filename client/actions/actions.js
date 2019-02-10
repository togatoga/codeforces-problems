import fetch from "cross-fetch";

export const REQUEST_PROBLEMS = "REQUEST_PROBLEMS";
export const RECEIVE_PROBLEMS = "RECEIVE_PROBLEMS";
export const REQUEST_SUBMISSIONS = "REQUEST_USERS";
export const RECEIVE_SUBMISSIONS = "RECEIVE_USERS";

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

function requestSubmissions(user, rivals) {
  return {
    type: REQUEST_SUBMISSIONS,
    user: user,
    rivals: rivals
  };
}

function receiveSubmissions(user, rivals) {
  return {
    type: RECEIVE_SUBMISSIONS,
    user: user,
    rivals: rivals
  };
}

export function fetchSubmissions(user, rivals) {
  const listUser = user.concat(",", rivals);

  return dispatch => {
    dispatch(requestSubmissions(user, rivals));
    return fetch(`http://localhost:1323/v1/submissions?users=${listUser}`)
      .then(response => response.json())
      .then(json => {
        const userJSON = json.submissions.filter(item => item.handle === user);
        const rivalsJSON = json.submissions.filter(
          item => item.handle !== user
        );
        dispatch(receiveSubmissions(userJSON, rivalsJSON));
      });
  };
}
