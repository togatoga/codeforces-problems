import React from "react";
import { Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ProblemFilter from "./ProblemFilter";
import VisibilitySetting from "./VisibilitySetting";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";

class ProblemList extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.updateState = this.updateState.bind(this);
  //   const { contests } = this.props;

  //   this.mapContestIdToName = contests.reduce(function(map, obj) {
  //     map[obj.contest_id] = obj.name;
  //     return map;
  //   }, {});
  // }

  nameFormatter(name, row) {
    const { contest_id, index } = row;
    const url = `http://codeforces.com/problemset/problem/${contest_id}/${index}`;

    return (
      <a href={url} target="_blank">
        {index}. {name}
      </a>
    );
  }
  contestFormatter(contest_id) {
    const url = `http://codeforces.com/contest/${contest_id}`;
    return (
      <a href={url} target="_blank">
        {contest_id}
      </a>
    );
  }
  tagsFormatter(data) {
    if (!Array.isArray(data)) {
      return;
    }
    const tags = data.map((tag, idx) => (
      <Badge key={idx} variant="info">
        {tag}
      </Badge>
    ));
    return <div>{tags}</div>;
  }
  solvedCountFormatter(solved_count) {
    return <div>{solved_count}</div>;
  }

  render() {
    const {
      problems,
      contests,
      user,
      rivals,
      filters,
      visibility
    } = this.props;
    const mapContestIdToName = contests.reduce(function(map, obj) {
      map[obj.contest_id] = obj.name;
      return map;
    }, {});
    const OKResult = user.filter(item => item.verdict === "OK");
    const WAResult = user.filter(
      item =>
        item.verdict !== "OK" &&
        !OKResult.some(value => value.problem_key === item.problem_key)
    );
    const RivalOKResult = rivals.filter(item => item.verdict === "OK");

    const filterAc = filters.statuses.includes("ac");
    const filterFailed = filters.statuses.includes("failed");
    const filterNotSolve = filters.statuses.includes("notSolve");
    const filterRivalsAc = filters.statuses.includes("rivalsAc");

    const filteredProblems = problems.filter(problem => {
      if (filters.selectedTags.length > 0) {
        if (problem.tags === null) {
          return false;
        }
        if (
          !problem.tags.some(function(tag) {
            return filters.selectedTags.some(
              selectedTag => selectedTag === tag
            );
          })
        ) {
          return false;
        }
      }
      if (!(filterAc || filterFailed || filterNotSolve || filterRivalsAc)) {
        return true;
      }

      if (filterAc || filterNotSolve) {
        const AC = OKResult.some(
          value => value.problem_key === problem.problem_key
        );
        if (AC && filterAc) {
          return true;
        }
        if (!AC && filterNotSolve) {
          return true;
        }
      }
      if (filterFailed) {
        const failed = WAResult.some(
          value => value.problem_key === problem.problem_key
        );
        if (failed) {
          return true;
        }
      }
      if (filterRivalsAc) {
        const rivalsAC = RivalOKResult.some(
          value =>
            value.problem_key === problem.problem_key &&
            !OKResult.some(user => user.problem_key === value.problem_key)
        );
        if (rivalsAC) {
          return true;
        }
      }

      return false;
    });

    const filteredTags = filteredProblems
      .map(problem => {
        return problem.tags;
      })
      .flat();

    return (
      <Grid container>
        <Grid item xs={12}>
          <VisibilitySetting />
        </Grid>
        <Grid item xs={12}>
          <ProblemFilter tags={filteredTags} />
        </Grid>
        <Grid item xs={12}>
          <BootstrapTable
            data={filteredProblems}
            striped={true}
            hover={true}
            trClassName={row => {
              const OK = OKResult.some(
                value =>
                  value.contest_id == row.contest_id &&
                  value.index === row.index
              );
              const WA = WAResult.some(
                value =>
                  value.contest_id === row.contest_id &&
                  value.index === row.index
              );
              const rivalOK = RivalOKResult.some(
                value =>
                  value.contest_id === row.contest_id &&
                  value.index === row.index
              );
              if (OK) {
                return "table-success";
              } else if (WA) {
                return "table-warning";
              } else if (rivalOK) {
                return "table-danger";
              }
              return "";
            }}
          >
            <TableHeaderColumn dataField="id" isKey={true} hidden={true} />

            <TableHeaderColumn
              dataField="contest_id"
              dataFormat={contest_id => {
                const url = `http://codeforces.com/contest/${contest_id}`;
                return (
                  <a href={url} target="_blank">
                    {mapContestIdToName[contest_id] || "No Name"}
                  </a>
                );
              }}
              width="30%"
              dataSort={true}
            >
              Contest ID
            </TableHeaderColumn>

            <TableHeaderColumn dataField="name" dataFormat={this.nameFormatter}>
              Problem
            </TableHeaderColumn>
            {visibility.solvedCount && (
              <TableHeaderColumn
                dataField="solved_count"
                dataSort={true}
                width="10%"
                dataFromat={this.solvedCountFormatter}
              >
                Solved
              </TableHeaderColumn>
            )}
            {visibility.tags && (
              <TableHeaderColumn
                dataField="tags"
                dataFormat={this.tagsFormatter}
              >
                Tags
              </TableHeaderColumn>
            )}
          </BootstrapTable>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const {
    problemsByApi,
    contestsByApi,
    usersByApi,
    filtersByUser,
    visibilityByUser
  } = state;
  const { problems } = problemsByApi;
  const { contests } = contestsByApi;
  const { user, rivals } = usersByApi;

  const { filters } = filtersByUser;
  const { visibility } = visibilityByUser;
  return {
    problems,
    contests,
    user,
    rivals,
    filters,
    visibility
  };
}

export default connect(mapStateToProps)(ProblemList);
