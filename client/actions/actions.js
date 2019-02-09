import fetch from "cross-fetch";

export const REQUEST_PROBLEMS = "REQUEST_PROBLEMS";
export const RECEIVE_PROBLEMS = "RECEIVE_PROBLEMS";
export const REQUEST_USERS = "REQUEST_USERS";
export const RECEIVE_USERS = "RECEIVE_USERS";

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

function requestUsers(user, rivals) {
  return {
    type: REQUEST_USERS,
    user: user,
    rivals: rivals
  };
}

function receiveUsers(user, rivals) {
  return {
    type: RECEIVE_USERS,
    user: json.users,
    rivals: json.rivals
  };
}

export function fetchUsers(user, rivals) {
  const listUser = user.concat(",", rivals);
  console.log(listUser);
  return dispatch => {
    dispatch(requestUsers(user, rivals));
    return fetch(`http://localhost:1323/v1/users?users=${listUser}`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveUsers(user, rivals));
      });
  };
}
