import React, { Component } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { Actions } from "react-native-router-flux";
import ModalView from "./ ModalView";
import { List, ListItem } from "react-native-elements";
import { styles } from "../theme/styles";
import SwipeDeleteable from "./SwipeDeleteable";
import { v4 as uuid } from "uuid";

export default class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      dataVersion: 0,
      isModalVisible: false
    };
  }

  componentDidMount() {
    const { realm } = this.props;
    const projects = realm
      .objects("Project")
      .filtered("owner == $0", this.props.user.identity)
      .sorted("timestamp", true);

    projects.addListener(() => {
      this.setState({
        dataVersion: this.state.dataVersion + 1
      });
    });

    this.subscription = projects.subscribe();
    this.subscription.addListener(this.onSubscriptionChange);
    this.setState({ projects });
  }

  componentWillUnmount() {
    const { projects } = this.state;
    if (this.subscription) {
      // Remove all listeners from the subscription
      this.subscription.removeAllListeners();
    }
    if (projects) {
      projects.removeAllListeners();
    }
  }

  onProjectCreation = projectName => {
    const { user, realm } = this.props;
    // Open a write transaction
    realm.write(() => {
      // Create a project
      realm.create("Project", {
        projectId: uuid(),
        owner: user.identity,
        name: projectName,
        timestamp: new Date()
      });
    });
    // Reset the state
    this.setState({ isModalVisible: false });
  };

  onProjectPress = project => {
    const { user, realm } = this.props;
    Actions.items({ project, realm, user, title: project.name });
  };

  onProjectDeletion = project => {
    const { realm } = this.props;
    // Open a write transaction
    realm.write(() => {
      // Delete the project
      realm.delete(project);
    });
  };

  onSubscriptionChange = () => {
    // Realm.Sync.SubscriptionState.Complete
    // Realm.Sync.SubscriptionState.Error
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  renderProject = ({ item }) => (
    <SwipeDeleteable
      key={item.projectId}
      onPress={() => {
        this.onProjectPress(item);
      }}
      onDeletion={() => {
        this.onProjectDeletion(item);
      }}
    >
      <ListItem
        title={item.name}
        badge={{
          value: item.items.length
        }}
        hideChevron={true}
      />
    </SwipeDeleteable>
  );

  projectKeyExtractor = project => project.projectId;

  render() {
    const { dataVersion, projects, isModalVisible } = this.state;
    return (
      <View>
        {!projects || projects.length === 0 ? (
          <Text style={styles.placeholder}>Create your first project</Text>
        ) : (
          <FlatList
            data={projects}
            extraData={dataVersion}
            renderItem={this.renderProject}
            keyExtractor={this.projectKeyExtractor}
          />
        )}
        <Button onPress={this.toggleModal} title="Create" />
        <ModalView
          placeholder="Please Enter a Project Name"
          confirmLabel="Create Project"
          isModalVisible={isModalVisible}
          toggleModal={this.toggleModal}
          handleSubmit={this.onProjectCreation}
        />
      </View>
    );
  }
}
