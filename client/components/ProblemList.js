import React from "react";
import { Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ProblemFilter from "./ProblemFilter";

export default class ProblemList extends React.Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
    const { contests } = this.props;
    this.mapContestIdToName = contests.reduce(function(map, obj) {
      map[obj.contest_id] = obj.name;
      return map;
    }, {});
  }
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
  updateState(state) {
    this.setState(state);
  }

  render() {
    const { problems, user, rivals, filters } = this.props;
    const OKResult = user.filter(item => item.verdict === "OK");
    const WAResult = user.filter(
      item =>
        item.verdict !== "OK" &&
        !OKResult.some(value => value.problem_key === item.problem_key)
    );
    const RivalOKResult = rivals.filter(item => item.verdict === "OK");

    const filterAc = filters.includes("ac");
    const filterFailed = filters.includes("failed");
    const filterNotSolve = filters.includes("notSolve");
    const filterRivalsAc = filters.includes("rivalsAc");

    const filteredProblems = problems.filter(problem => {
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

    return (
      <div>
        <ProblemFilter filters={filters} updateState={this.updateState} />
        <BootstrapTable
          data={filteredProblems}
          striped={true}
          hover={true}
          trClassName={row => {
            const OK = OKResult.some(
              value =>
                value.contest_id == row.contest_id && value.index === row.index
            );
            const WA = WAResult.some(
              value =>
                value.contest_id === row.contest_id && value.index === row.index
            );
            const rivalOK = RivalOKResult.some(
              value =>
                value.contest_id === row.contest_id && value.index === row.index
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
                  {this.mapContestIdToName[contest_id] || "No Name"}
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
          <TableHeaderColumn
            dataField="solved_count"
            dataSort={true}
            width="10%"
            dataFromat={this.solvedCountFormatter}
          >
            Solved
          </TableHeaderColumn>

          {/* <TableHeaderColumn>Last Submit Date</TableHeaderColumn> */}
          <TableHeaderColumn dataField="tags" dataFormat={this.tagsFormatter}>
            Tags
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
