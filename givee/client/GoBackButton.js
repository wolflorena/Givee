import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";

import { useLoginUpdateContext } from "./LoginContext";
import { ThemeContext } from "./ThemeContext";

export default function GoBackButton() {
  const navigation = useNavigation();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

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
const getStyles = (theme) =>
  StyleSheet.create({
    goBackButton: {
      marginTop: 70,
      marginRight: 330,
    },
    goBackIcon: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
    },
  });
