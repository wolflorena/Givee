import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import NavBar from "../Navbar";
import { useLoginUpdateContext } from "../LoginContext";
import Title from "../Title";
import DonationForm from "../DonationForm";

export default function Clothes() {
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

      <Title text="Donate clothes" />
      <DonationForm product="Clothes" />
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
