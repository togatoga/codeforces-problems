import React, { Component } from "react";
import { fetchProblems, fetchContests, setFilters } from "../actions/actions";
import ProblemList from "../components/ProblemList";
import SearchForm from "../components/SearchForm";
import NavigationBar from "../components/NavigationBar";
import ProblemFilter from "../components/ProblemFilter";
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
    const { problems, contests, user, rivals, filters } = this.props;

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
                  filters={filters}
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
  const { problemsByApi, contestsByApi, usersByApi, filtersByUser } = state;
  const { problems } = problemsByApi;
  const { contests } = contestsByApi;
  const { user, rivals } = usersByApi;
  const { filters } = filtersByUser;

  return {
    problems,
    contests,
    user,
    rivals,
    filters
  };
}

export default connect(mapStateToProps)(AsyncApp);
