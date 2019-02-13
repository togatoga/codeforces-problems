import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { setFilters } from "../actions/actions";

class ComponentProblemFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      filters: this.props.filters
    };
  }

  handleClick(filters) {
    this.setState({ filters: filters });
    this.props.setFilters(filters);
    this.props.updateState(this.state);
  }
  render() {
    const { filters } = this.props;
    return (
      <ButtonGroup>
        <Button
          variant="outline-dark"
          active={filters.not_solve}
          onClick={e => {
            e.preventDefault();
            filters.not_solve = !filters.not_solve;
            this.handleClick(filters);
          }}
        >
          Not Solve
        </Button>
        <Button
          variant="outline-success"
          active={filters.ac}
          onClick={e => {
            e.preventDefault();
            filters.ac = !filters.ac;
            this.handleClick(filters);
          }}
        >
          AC
        </Button>
        <Button
          variant="outline-warning"
          active={filters.rivals_ac}
          onClick={e => {
            e.preventDefault();
            filters.rivals_ac = !filters.rivals_ac;
            this.handleClick(filters);
          }}
        >
          Rivals AC
        </Button>
        <Button
          variant="outline-danger"
          active={filters.failed}
          onClick={e => {
            e.preventDefault();
            filters.failed = !filters.failed;
            this.handleClick(filters);
          }}
        >
          Failed
        </Button>
      </ButtonGroup>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setFilters: filters => dispatch(setFilters(filters))
  };
}
const ProblemFilter = connect(
  null,
  mapDispatchToProps
)(ComponentProblemFilter);

export default ProblemFilter;
