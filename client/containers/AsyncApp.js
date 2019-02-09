import React, { Component } from "react";
import { fetchProblems } from "../actions/actions";
import Problems from "../components/Problems";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";

class AsyncApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProblems());
  }
  render() {
    const { problems } = this.props;
    return (
      <Container>
        {problems.length > 0 && <Problems problems={problems} />}
      </Container>
    );
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