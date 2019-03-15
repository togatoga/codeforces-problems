import React from "react";
import { ToggleButton, ToggleButtonGroup, Slider } from "@material-ui/lab";
import { connect } from "react-redux";
import { setFilters } from "../actions/actions";
import {
  FormControl,
  Select,
  Chip,
  MenuItem,
  InputLabel,
  Grid
} from "@material-ui/core";

class ProblemFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, statuses) {
    e.preventDefault();
    this.props.setFilters(
      Object.assign({}, this.props.filters, {
        statuses: statuses
      })
    );
  }

  render() {
    const { filters, visibility } = this.props;
    const { statuses, tags, selectedTags } = filters;

    return (
      <Grid container>
        <Grid container>
          {visibility.tags && (
            <Grid item xs={4}>
              <FormControl fullWidth={true}>
                <InputLabel>Problem Tag</InputLabel>
                <Select
                  multiple
                  value={selectedTags}
                  onChange={e => {
                    var filters = this.props.filters;
                    filters.selectedTags = e.target.value;
                    this.props.setFilters(this.props.filters);
                  }}
                  renderValue={selected => (
                    <div>
                      {selected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  {tags.map(tag => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <ToggleButtonGroup value={statuses} onChange={this.handleChange}>
            <ToggleButton value="notSolve">Not Solve</ToggleButton>
            <ToggleButton value="ac">Accepted</ToggleButton>
            <ToggleButton value="rivalsAc">Rivals Accepted</ToggleButton>
            <ToggleButton value="failed">Failed</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    filters: state.filtersByUser.filters,
    visibility: state.visibilityByUser.visibility
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setFilters: values => dispatch(setFilters(values))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemFilter);
