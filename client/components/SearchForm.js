import React from "react";
import { connect } from "react-redux";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Col,
  Row
} from "react-bootstrap";
import { fetchUsers } from "../actions/actions";

class ComponentSearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      user: "",
      rivals: ""
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    this.props.fetchUsers(this.state.user, this.state.rivals);
  }
  render() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Form.Row>
          <FormGroup as={Col} md="6">
            <FormLabel>User</FormLabel>
            <FormControl
              type="text"
              placeholder="tourist"
              name="user"
              value={this.state.user}
              onChange={e => this.setState({ user: e.target.value })}
            />
          </FormGroup>
          <FormGroup as={Col} md="6">
            <FormLabel>Rivals</FormLabel>
            <FormControl
              type="text"
              placeholder="chokudai,snuke"
              name="rivals"
              value={this.state.rivals}
              onChange={e => this.setState({ rivals: e.target.value })}
            />
          </FormGroup>
        </Form.Row>
        <Form.Row>
          <FormGroup as={Row}>
            <Button type="submit">Search</Button>
          </FormGroup>
        </Form.Row>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUsers: (user, rivals) => dispatch(fetchUsers(user, rivals))
  };
}
const SearchForm = connect(
  null,
  mapDispatchToProps
)(ComponentSearchForm);

export default SearchForm;
