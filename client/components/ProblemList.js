import React from "react";
import { Container, Row, Badge, Table } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class ProblemList extends React.Component {
  nameFormatter(name, row) {
    const { contest_id, index } = row;
    const url = `http://codeforces.com/problemset/problem/${contest_id}/${index}`;

    return (
      <a href={url} target="_blank">
        {name}
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
      <Container>
        <Row>
          <BootstrapTable data={problems} striped={true} hover={true}>
            <TableHeaderColumn dataField="id" isKey={true} hidden={true} />
            <TableHeaderColumn dataField="name" dataFormat={this.nameFormatter}>
              Problem
            </TableHeaderColumn>

            <TableHeaderColumn dataField="points">Points</TableHeaderColumn>
            <TableHeaderColumn dataField="tags" dataFormat={this.tagsFormatter}>
              Tags
            </TableHeaderColumn>
          </BootstrapTable>
        </Row>
      </Container>
    );
  }
}
