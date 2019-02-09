import React from "react";
import { Container, Row, Badge } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class Problems extends React.Component {
  tagsFormatter(tags) {
    return tags.map(tag => {
      return <Badge>{tag}</Badge>;
    });
  }
  render() {
    const { problems } = this.props;
    console.log(problems);
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
