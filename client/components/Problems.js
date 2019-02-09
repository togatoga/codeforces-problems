import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export default class Problems extends React.Component {
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
            <TableHeaderColumn dataField="tags">Tags</TableHeaderColumn>
            {/* <thead class="thead-default">
              <tr>
                <th>Problem</th>
                <th>Points</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {problems.length > 0 &&
                problems.map(problem => (
                  <tr>
                    <td>
                      <a
                        href={`http://codeforces.com/problemset/problem/${
                          problem.contest_id
                        }/${problem.index}`}
                        target="_blank"
                      >
                        {problem.name}
                      </a>
                    </td>
                    <td>{problem.points}</td>
                    <td>
                      {problem.tags.map(tag => (
                        <span class="label label-primary">{tag}</span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody> */}
          </BootstrapTable>
        </Row>
      </Container>
    );
  }
}
