import React, { Component } from "react";
import { fetchProblems } from "../actions/actions";
import Problems from "../components/Problems";
import { connect } from "react-redux";

class AsyncApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProblems());
  }
  render() {
    return <Problems problems={this.props.problems} />;
  }
}

function mapStateToProps(state) {
  const { problemsByApi } = state;
  const { problems } = problemsByApi;

  return {
    problems
  };
}

export default connect(mapStateToProps)(AsyncApp);
