import React, { Component } from "react";
import { fetchProblems, fetchContests } from "../actions/actions";
import ProblemList from "../components/ProblemList";
import SearchForm from "../components/SearchForm";
import NavigationBar from "../components/NavigationBar";
import { connect } from "react-redux";
import { Container, Row } from "react-bootstrap";

class AsyncApp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProblems());
    dispatch(fetchContests());
  }
  render() {
    const { problems, contests, user, rivals } = this.props;
    return (
      <div>
        <NavigationBar />
        <Container>
          <Container>
            <Row>
              <SearchForm user={user} rivals={rivals} />
            </Row>
          </Container>
          <Container>
            <Row>
              {problems.length > 0 && (
                <ProblemList
                  problems={problems}
                  contests={contests}
                  user={user}
                  rivals={rivals}
                />
              )}
            </Row>
          </Container>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { problemsByApi, usersByApi, contestsByApi } = state;
  const { contests } = contestsByApi;
  const { problems } = problemsByApi;
  const { user, rivals } = usersByApi;

  return {
    problems,
    contests,
    user,
    rivals
  };
}

export default connect(mapStateToProps)(AsyncApp);
