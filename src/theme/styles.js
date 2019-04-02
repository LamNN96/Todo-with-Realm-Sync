import { StyleSheet } from "react-native";

const white = "white";

export const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    backgroundColor: white,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4
  },
  input: {
    width: "100%",
    textAlign: "center"
  },
  buttonsLogin: {
    flexDirection: "row",
    marginTop: 10
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  placeholder: {
    textAlign: "center",
    padding: 10
  }
});
