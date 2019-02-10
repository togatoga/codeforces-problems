import React from "react";
import { Navbar, NavbarBrand, NavDropdown, Col } from "react-bootstrap";

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar bg="dark" variant="dark" collapseOnSelect>
        <Col md={1} xs={1} />
        <NavbarBrand>Codeforces Problems</NavbarBrand>
        <NavbarBrand>
          <NavDropdown title="Link" id="collasible-nav-dropdown">
            <NavDropdown.Item href="http://codeforces.com">
              Codeforces Official Site
            </NavDropdown.Item>
            <NavDropdown.Item href="https://kenkoooo.com/atcoder/">
              AtCoder Problems
            </NavDropdown.Item>
            <NavDropdown.Item href="https://twitter.com/togatoga_">
              @togatoga_
            </NavDropdown.Item>
          </NavDropdown>
        </NavbarBrand>
      </Navbar>
    );
  }
}
