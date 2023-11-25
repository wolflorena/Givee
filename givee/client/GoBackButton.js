import { TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { useLoginUpdateContext } from "./LoginContext";

export default function GoBackButton() {
  const navigation = useNavigation();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  return (
    <TouchableOpacity
      style={styles.goBackButton}
      onPress={() => {
        navBarButtonsPressHandler("homeIsPressed");
        navigation.goBack();
      }}
    >
      <FontAwesomeIcon
        style={styles.goBackIcon}
        icon={faCircleChevronLeft}
        size={25}
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
});
