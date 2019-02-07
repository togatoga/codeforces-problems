import fetch from "cross-fetch";

export const REQUEST_PROBLEMS = "REQUEST_PROBLEMS";
export const RECEIVE_PROBLEMS = "RECEIVE_PROBLEMS";

function requestProblems() {
  return {
    type: REQUEST_PROBLEMS
  };
}
