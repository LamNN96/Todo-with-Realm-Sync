import React, { Component } from "react";
import { View, Text } from "react-native";
import Realm from "realm";
import { Login } from "./src/components/Login";
export default class App extends Component {
  render() {
    return <Login />;
  }
}
