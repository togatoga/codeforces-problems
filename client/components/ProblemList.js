import React from "react";
import ProblemFilter from "./ProblemFilter";
import VisibilitySetting from "./VisibilitySetting";
import { Grid, Paper, Chip, Link, InputLabel } from "@material-ui/core";
import { Badge } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import { connect } from "react-redux";
import { createSelector } from "reselect";

class ProblemList extends React.Component {
  nameFormatter(name, contest_id, index) {
    const url = `http://codeforces.com/problemset/problem/${contest_id}/${index}`;

    return (
      <Link href={url} target="_blank">
        {index}. {name}
      </Link>
    );
  }
  contestFormatter(contest_id, mapContestIdToName) {
    const url = `http://codeforces.com/contest/${contest_id}`;
    return (
      <a href={url} target="_blank">
        {mapContestIdToName[contest_id] || "No Name"}
      </a>
    );
  }
  tagsFormatter(tags) {
    if (tags === null || !Array.isArray(tags)) {
      return <div />;
    }

    return (
      <div>
        {tags.map(tag => (
          <Chip key={tag} label={tag} />
        ))}
      </div>
    );
  }

  render() {
    const { problems, contests, userStatus, visibility } = this.props;
    const mapContestIdToName = contests.reduce(function(map, obj) {
      map[obj.contest_id] = obj.name;
      return map;
    }, {});

    const options = {
      rowsPerPage: 50,
      selectableRows: false
    };

    const coloredProblems = problems.map(problem => {
      if (
        userStatus.user.ac.some(
          value => value.problem_key === problem.problem_key
        )
      ) {
        problem.status = "AC";
        return problem;
      }
      if (
        userStatus.user.wa.some(
          value => value.problem_key === problem.problem_key
        )
      ) {
        problem.status = "Failed";
        return problem;
      }
      if (
        userStatus.rivals.ac.some(
          value => value.problem_key === problem.problem_key
        )
      ) {
        problem.status = "RivalAC";
        return problem;
      }
      problem.status = "";
      return problem;
    });

    const columns = [
      {
        name: "contest_id",
        label: "Contest",
        options: {
          customBodyRender: value => {
            return this.contestFormatter(value, mapContestIdToName);
          },
          filter: true,
          sort: true
        }
      },
      {
        name: "name",
        label: "Problem",
        options: {
          customBodyRender: (value, tableMeta) => {
            const { contest_id, index } = problems[tableMeta.rowIndex];
            return this.nameFormatter(value, contest_id, index);
          },
          filter: false,
          sort: false,
          display: "true"
        }
      },
      {
        name: "status",
        label: "Status",
        options: {
          customBodyRender: value => {
            if (value === "") {
              return <div />;
            }
            var color = "";
            if (value === "AC") {
              color = "success";
            } else if (value === "Failed") {
              color = "warning";
            } else if (value === "RivalAC") {
              color = "danger";
            }
            return (
              <div>
                <h5>
                  <Badge variant={color}>{value}</Badge>
                </h5>
              </div>
            );
          },
          filter: false,
          sort: true
        }
      },
      {
        name: "points",
        label: "Point",
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "solved_count",
        label: "Solvers",
        options: {
          filter: true,
          sort: true,
          display: visibility.solvedCount
        }
      },
      {
        name: "tags",
        label: "Tags",
        options: {
          customBodyRender: value => {
            return this.tagsFormatter(value);
          },
          filter: false,
          display: visibility.tags
        }
      }
    ];
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
          <Paper>
            {coloredProblems.length > 0 && (
              <MUIDataTable
                title="Problem List"
                data={coloredProblems}
                columns={columns}
                options={options}
              />
            )}
          </Paper>
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
