import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { connect } from "react-redux";
import { setFilters } from "../actions/actions";

class ComponentProblemFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      filters: this.props.filters
    };
  }

  handleChange(e, filters) {
    e.preventDefault();
    this.setState({ filters: filters });
    this.props.setFilters(filters);
    this.props.updateState(this.state);
  }
  render() {
    const { filters } = this.state;
    return (
      <ToggleButtonGroup value={filters} onChange={this.handleChange}>
        <ToggleButton value="notSolve">Not Solve</ToggleButton>
        <ToggleButton value="ac">Accepted</ToggleButton>
        <ToggleButton value="rivalsAc">Rivals Accepted</ToggleButton>
        <ToggleButton value="failed">Failed</ToggleButton>
      </ToggleButtonGroup>
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
