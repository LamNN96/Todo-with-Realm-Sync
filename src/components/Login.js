import React, { Component } from "react";
import { View, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import Realm from "realm";

import { SERVER_URL } from "../constants";
import { Project, Item } from "../schema";

import ModalView from "./ ModalView";
import { styles } from "../theme/styles";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // Check if we're already authenticated
    if (Realm.Sync.User.current) {
      this.onAuthenticated(Realm.Sync.User.current);
    } else {
      this.setState({ isModalVisible: true });
    }
  }

  handleSubmit = async nickname => {
    try {
      // Reset any previous errors that might have happened
      this.setState({ error: undefined });
      // Attempt to authenticate towards the server
      const user = await Realm.Sync.User.registerWithProvider(SERVER_URL, {
        provider: "nickname",
        providerToken: nickname
      });
      // Hide the modal
      this.setState({ isModalVisible: false });
      this.onAuthenticated(user);
    } catch (error) {
      this.setState({ isModalVisible: true, error });
    }
  };

  onAuthenticated(user) {
    // Create a configuration to open the default Realm
    const config = user.createConfiguration({
      schema: [Project, Item]
    });
    // Open the Realm
    const realm = new Realm(config);
    // Navigate to the main scene
    Actions.authenticated({ user, realm });
  }

  onLogout = () => {
    if (Realm.Sync.User.current) {
      Realm.Sync.User.current.logout();
      this.forceUpdate();
    }
  };

  onOpenProjects = () => {
    if (Realm.Sync.User.current) {
      this.onAuthenticated(Realm.Sync.User.current);
    }
  };

  render() {
    const isAuthenticated = !!Realm.Sync.User.current;
    return (
      <View style={styles.container}>
        <ModalView
          placeholder="Please Enter a Username"
          confirmLabel="Login"
          isModalVisible={!isAuthenticated}
          handleSubmit={this.handleSubmit}
          error={this.state.error}
        />
        {isAuthenticated && (
          <View style={styles.buttons}>
            <Button onPress={this.onLogout} title="Logout" />
            <Button onPress={this.onOpenProjects} title="Go to projects" />
          </View>
        )}
      </View>
    );
  }
}
