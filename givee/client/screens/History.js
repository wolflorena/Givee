import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import NavBar from "../Navbar";
import { useLoginUpdateContext } from "../LoginContext";

export default function Centers() {
  const navigation = useNavigation();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  return (
    <View style={styles.container}>
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

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
});
