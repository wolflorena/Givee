import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { useLoginUpdateContext } from "../LoginContext";
import Title from "../Title";
import DonationForm from "../DonationForm";
import NavBar from "../Navbar";

export default function Food() {
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

      <Title text="Donate Food" />
      <DonationForm product="Food" />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
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
