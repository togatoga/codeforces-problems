import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Button
} from "@material-ui/core";

import { NavbarBrand, NavDropdown } from "react-bootstrap";

export default class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Codeforces Problems
          </Typography>
          <NavbarBrand>
            <NavDropdown title="Link" id="collasible-nav-dropdown">
              <NavDropdown.Item href="http://codeforces.com">
                Codeforces Official Site
              </NavDropdown.Item>
              <NavDropdown.Item href="https://kenkoooo.com/atcoder/">
                AtCoder Problems
              </NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/togatoga/codeforces-problems">
                GitHub
              </NavDropdown.Item>
              <NavDropdown.Item href="https://twitter.com/togatoga_">
                @togatoga_
              </NavDropdown.Item>
            </NavDropdown>
          </NavbarBrand>
        </Toolbar>
      </AppBar>
    );
  }
}
