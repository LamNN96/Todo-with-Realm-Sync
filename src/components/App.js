import React, { Component } from "react";
import { Scene, Stack, Router } from "react-native-router-flux";
import { Login } from "./Login";
import ProjectList from "./ProjectList";
import ItemList from "./ItemList";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene hideNavBar={true}>
          <Scene key="login" component={Login} title="Please Login" />
          <Stack key="authenticated">
            <Scene key="projects" component={ProjectList} title="Projects" />
            <Scene key="items" component={ItemList} title="Items" />
          </Stack>
        </Scene>
      </Router>
    );
  }
}
