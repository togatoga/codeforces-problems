import React from "react";
import { Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ProblemFilter from "./ProblemFilter";
import VisibilitySetting from "./VisibilitySetting";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { createSelector } from "reselect";

class ProblemList extends React.Component {
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
    const { problems, contests, userStatus, visibility } = this.props;
    const mapContestIdToName = contests.reduce(function(map, obj) {
      map[obj.contest_id] = obj.name;
      return map;
    }, {});

    const tags = problems
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
          <ProblemFilter tags={tags} />
        </Grid>
        <Grid item xs={12}>
          <BootstrapTable
            data={problems}
            striped={true}
            hover={true}
            trClassName={row => {
              const OK = userStatus.user.ac.some(
                value =>
                  value.contest_id == row.contest_id &&
                  value.index === row.index
              );
              const WA = userStatus.user.wa.some(
                value =>
                  value.contest_id === row.contest_id &&
                  value.index === row.index
              );
              const rivalOK = userStatus.rivals.ac.some(
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

const problemsSelector = state => state.problemsByApi.problems;
const filtersSelector = state => state.filtersByUser.filters;
const userSelector = state => state.usersByApi.user;
const rivalsSelector = state => state.usersByApi.rivals;

export const userStatusSelector = createSelector(
  [userSelector, rivalsSelector],
  (user, rivals) => {
    const userACStatus = user.filter(item => item.verdict === "OK");
    const userWAStatus = user.filter(
      item =>
        item.verdict !== "OK" &&
        !userACStatus.some(value => value.problem_key == item.problem_key)
    );
    const rivalsACStatus = rivals.filter(item => item.verdict === "OK");
    return {
      user: {
        ac: userACStatus,
        wa: userWAStatus
      },
      rivals: {
        ac: rivalsACStatus
      }
    };
  }
);

export const filteredProblemsSelector = createSelector(
  [problemsSelector, filtersSelector, userStatusSelector],
  (problems, filters, userStatus) => {
    const filterAc = filters.statuses.includes("ac");
    const filterFailed = filters.statuses.includes("failed");
    const filterNotSolve = filters.statuses.includes("notSolve");
    const filterRivalsAc = filters.statuses.includes("rivalsAc");
    return problems.filter(problem => {
      //Tag
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
        const AC = userStatus.user.ac.some(
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
        const failed = userStatus.user.wa.some(
          value => value.problem_key === problem.problem_key
        );
        if (failed) {
          return true;
        }
      }
      if (filterRivalsAc) {
        const rivalsAC = userStatus.rivals.ac.some(
          value =>
            value.problem_key === problem.problem_key &&
            !userStatus.user.ac.some(
              user => user.problem_key === value.problem_key
            )
        );
        if (rivalsAC) {
          return true;
        }
      }

      return false;
    });
  }
);

function mapStateToProps(state) {
  const { contestsByApi, visibilityByUser } = state;
  const { contests } = contestsByApi;
  const { visibility } = visibilityByUser;
  return {
    problems: filteredProblemsSelector(state),
    contests,
    userStatus: userStatusSelector(state),
    filters: filtersSelector(state),
    visibility
  };
}

export default connect(mapStateToProps)(ProblemList);
