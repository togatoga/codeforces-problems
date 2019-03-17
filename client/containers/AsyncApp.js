import React, { Component } from "react";
import { fetchProblems, fetchContests } from "../actions/actions";
import ProblemList from "../components/ProblemList";
import SearchForm from "../components/SearchForm";
import NavigationBar from "../components/NavigationBar";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

class AsyncApp extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchProblems());
    dispatch(fetchContests());
  }
  render() {
    return (
      <div>
        <Grid container>
          <NavigationBar />
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <SearchForm />
          </Grid>
          <Grid item xs={12}>
            <ProblemList />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default connect()(AsyncApp);
