import React, { Component } from "react";
import { View, Text, TextInput, Button } from "react-native";
import Modal from "react-native-modal";
import { styles } from "../theme/styles";

export default class ModalView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isModalVisible && this.props.isModalVisible) {
      this.setState({ text: "" });
    }
  }

  onChangeText = text => {
    this.setState({ text });
  };

  onConfirm = () => {
    this.props.handleSubmit(this.state.text);
  };

  render() {
    const {
      confirmLabel,
      error,
      isModalVisible,
      placeholder,
      toggleModal
    } = this.props;

    return (
      <Modal isVisible={isModalVisible}>
        <View style={styles.content}>
          {error && <Text>{error.message}</Text>}
          <TextInput
            style={styles.input}
            autoFocus={true}
            placeholder={placeholder}
            onChangeText={this.onChangeText}
            value={this.state.text}
            onSubmitEditing={this.onConfirm}
          />
          <View style={styles.buttonsLogin}>
            <Button
              onPress={this.onConfirm}
              title={confirmLabel || "Confirm"}
            />
            {toggleModal ? (
              <Button onPress={toggleModal} title="Cancel" />
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }
}
