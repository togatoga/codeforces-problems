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
          <Button type="submit" variant="contained">
            Search
          </Button>
        </FormControl>
      </form>
      // <Form onSubmit={e => this.handleSubmit(e)}>
      //   <Form.Row>
      //     <FormGroup as={Col} md="6">
      //       <FormLabel>User</FormLabel>
      //       <FormControl
      //         type="text"
      //         placeholder="tourist"
      //         name="user"
      //         value={this.props.user}
      //         onChange={e => {
      //           e.preventDefault();
      //           this.state.user = e.target.value;
      //         }}
      //       />
      //     </FormGroup>
      //     <FormGroup as={Col} md="6">
      //       <FormLabel>Rivals</FormLabel>
      //       <FormControl
      //         type="text"
      //         placeholder="chokudai,snuke"
      //         name="rivals"
      //         value={this.props.rivals}
      //         onChange={e => {
      //           e.preventDefault();
      //           this.state.rivals = e.target.value;
      //         }}
      //       />
      //     </FormGroup>
      //   </Form.Row>
      //   <FormGroup>
      //     <Button type="submit">Search</Button>
      //   </FormGroup>
      // </Form>
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
