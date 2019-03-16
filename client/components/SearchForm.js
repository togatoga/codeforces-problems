import React from "react";
import { connect } from "react-redux";
import { FormControl, TextField } from "@material-ui/core";
import { fetchSubmissions } from "../actions/actions";
import { Button, Input } from "react-bootstrap";

class ComponentSearchForm extends React.Component {
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
    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <FormControl>
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
          />
          <Button type="submit" color="primary">
            Search
          </Button>
        </FormControl>
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
const SearchForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComponentSearchForm);

export default SearchForm;
