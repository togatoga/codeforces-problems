import React, { Component } from "react";
import { fetchProblems } from "../actions/actions";
import ProblemList from "../components/ProblemList";
import SearchForm from "../components/SearchForm";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";

class AsyncApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProblems());
  }
  render() {
    const { problems, user, rivals } = this.props;
    return (
      <Container>
        <Container>
          <Row>
            <SearchForm user={user} rivals={rivals} />
          </Row>
        </Container>
        <Container>
          <Row>
            {problems.length > 0 && (
              <ProblemList problems={problems} user={user} rivals={rivals} />
            )}
          </Row>
        </Container>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { problemsByApi, usersByApi } = state;
  const { problems } = problemsByApi;
  const { user, rivals } = usersByApi;

  return {
    problems,
    user,
    rivals
  };
}

export default connect(mapStateToProps)(AsyncApp);
