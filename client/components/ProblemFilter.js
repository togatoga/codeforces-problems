import React from "react";
import { Button } from "@material-ui/core";
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
          variant="outlined"
          onClick={e => {
            e.preventDefault();
            filters.not_solve = !filters.not_solve;
            this.handleClick(filters);
          }}
        >
          Not Solve
        </Button>
        <Button
          variant="outlined"
          onClick={e => {
            e.preventDefault();
            filters.ac = !filters.ac;
            this.handleClick(filters);
          }}
        >
          AC
        </Button>
        <Button
          variant="outlined"
          onClick={e => {
            e.preventDefault();
            filters.rivals_ac = !filters.rivals_ac;
            this.handleClick(filters);
          }}
        >
          Rivals AC
        </Button>
        <Button
          variant="outlined"
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
