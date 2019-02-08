import React from "react";

export default class Problems extends React.Component {
  render() {
    const { problems } = this.props;
    return (
      <div id="container">
        <table class="table table-striped">
          <thead class="thead-default">
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
          </tbody>
        </table>
      </div>
    );
  }
}
