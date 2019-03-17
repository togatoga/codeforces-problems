import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { TextField, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { fetchSubmissions } from "../actions/actions";

const styles = theme => ({
  container: {
    padding: "10px",
    display: "flex"
  }
});

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      user: this.props.user,
      rivals: this.props.rivals
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.fetchSubmissions(this.state.user, this.state.rivals);
  }

  render() {
    const { classes } = this.props;
    return (
      <form onSubmit={e => this.handleSubmit(e)} className={classes.container}>
        <TextField
          label="user"
          value={this.state.user}
          variant="outlined"
          onChange={e => {
            this.setState({ user: e.target.value });
          }}
        />
        <TextField
          label="rivals"
          value={this.state.rivals}
          variant="outlined"
          onChange={e => {
            this.setState({ rivals: e.target.value });
          }}
        />{" "}
        <Button type="submit" variant="contained">
          Search
        </Button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.usersByApi.user, rivals: state.usersByApi.rivals };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchSubmissions: (user, rivals) => dispatch(fetchSubmissions(user, rivals))
  };
}
export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SearchForm);
