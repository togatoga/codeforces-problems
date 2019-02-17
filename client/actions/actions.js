import fetch from "cross-fetch";

export const REQUEST_PROBLEMS = "REQUEST_PROBLEMS";
export const RECEIVE_PROBLEMS = "RECEIVE_PROBLEMS";
export const REQUEST_SUBMISSIONS = "REQUEST_USERS";
export const RECEIVE_SUBMISSIONS = "RECEIVE_USERS";
export const REQUEST_CONTESTS = "REQUEST_CONTESTS";
export const RECEIVE_CONTESTS = "RECIEVE_CONTESTS";
export const SET_FILTERS = "SET_FILTERS";
export const RECEIVE_FILTERS = "RECIEVE_FILTERS";

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
    return fetch("http://localhost:1323/api/v1/problems")
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
    return fetch(`http://localhost:1323/api/v1/submissions?users=${listUser}`)
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

function requestContests() {
  return {
    type: REQUEST_CONTESTS
  };
}

function receiveContests(json) {
  return {
    type: RECEIVE_CONTESTS,
    contests: json.contests
  };
}

export function fetchContests() {
  return dispatch => {
    dispatch(requestContests());
    return fetch("http://localhost:1323/api/v1/contests")
      .then(response => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }
        return response.json();
      })
      .then(json => dispatch(receiveContests(json)));
  };
}

function receiveFilters(filters) {
  return {
    type: RECEIVE_FILTERS,
    filters: filters
  };
}

export function setFilters(filters) {
  return dispatch => {
    return dispatch(receiveFilters(filters));
  };
}
