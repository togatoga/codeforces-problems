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
      <Badge key={idx} variant="success">
        {tag}
      </Badge>
    ));
    return <span>{tags}</span>;
  }
  render() {
    const { problems } = this.props;
    return (
      <BootstrapTable data={problems} striped={true} hover={true}>
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
