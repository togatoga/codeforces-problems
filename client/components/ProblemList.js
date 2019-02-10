import React from "react";
import { Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class ProblemList extends React.Component {
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
    const tags = data.map((tag, idx) => (
      <Badge key={idx} variant="info">
        {tag}
      </Badge>
    ));
    return <span>{tags}</span>;
  }

  render() {
    const { problems, user, rivals } = this.props;

    const OKResult = user.filter(item => item.verdict === "OK");
    const WAResult = user.filter(item => item.verdict !== "OK");
    const RivalOKResult = rivals.filter(item => item.verdict === "OK");

    return (
      <BootstrapTable
        data={problems}
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
            return "table-danger";
          } else if (rivalOK) {
            return "table-warning";
          }
          return "";
        }}
      >
        <TableHeaderColumn dataField="id" isKey={true} hidden={true} />

        <TableHeaderColumn dataField="name" dataFormat={this.nameFormatter}>
          Problem
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="contest_id"
          dataFormat={this.contestFormatter}
          width="10%"
          dataSort={true}
        >
          Contest ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="points" width="10%" dataSort={true}>
          Points
        </TableHeaderColumn>
        <TableHeaderColumn dataField="solved_count" width="10%" dataSort={true}>
          Solved
        </TableHeaderColumn>
        <TableHeaderColumn dataField="tags" dataFormat={this.tagsFormatter}>
          Tags
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
