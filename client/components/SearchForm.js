import React from "React";
import { Form, FormGroup, FormLabel, FormControl } from "react-bootstrap";

export default class SearchForm extends React.Component {
  render() {
    return (
      <Form>
        <FormGroup>
          <FormLabel>User</FormLabel>
          <FormControl type="text" placeholder="tourist" />
        </FormGroup>
      </Form>
    );
  }
}
