import React from "react";
import { Container, Row, Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class ProblemList extends React.Component {
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
            <TableHeaderColumn dataField="name" isKey={true}>
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
