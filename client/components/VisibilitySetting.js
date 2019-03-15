import React from "react";
import { FormGroup } from "react-bootstrap";
import { FormControlLabel, Switch } from "@material-ui/core";
import { setVisibility } from "../actions/actions";
import { connect } from "react-redux";

class VisibilitySetting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              value="bool"
              onChange={(e, checked) => {
                e.preventDefault();
                this.props.setVisibility({
                  solvedCount: this.props.visibility.solvedCount,
                  tags: checked
                });
              }}
            />
          }
          label="Visible Tags"
        />
        <FormControlLabel
          control={
            <Switch
              value="bool"
              onChange={(e, checked) => {
                e.preventDefault();
                this.props.setVisibility({
                  solvedCount: checked,
                  tags: this.props.visibility.tags
                });
              }}
            />
          }
          label="Visible Solved Count"
        />
      </FormGroup>
    );
  }
}

function mapStateToProps(state) {
  return { visibility: state.visibilityByUser.visibility };
}
function mapDispatchToProps(dispatch) {
  return {
    setVisibility: value => dispatch(setVisibility(value))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibilitySetting);
