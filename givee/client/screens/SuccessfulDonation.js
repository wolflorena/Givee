import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";
import Navbar from "../Navbar";

export default function SuccessfulDonation() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/superheroIcon.png")}
      ></Image>
      <View style={styles.yellowTextContainer}>
        <Text style={styles.yellowMessage}>
          Hooray! {"\n"} You just helped a life with your donation.
        </Text>
      </View>

      <View style={styles.whiteTextContainer}>
        <Text style={styles.whiteText}>
          You can bring your donated items to the location specified in the
          form. Thank you for your donation!❤️
        </Text>
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    resizeMode: "stretch",
    width: 250,
    height: 250,
  },
  yellowMessage: {
    fontSize: 20,
    color: "#ddb31b",
    textAlign: "center",
  },
  yellowTextContainer: {
    width: 250,
    justifyContent: "center",
  },
  whiteText: {
    color: "#eaebed",
    fontSize: 15,
    textAlign: "center",
  },
  whiteTextContainer: {
    width: 300,
    marginTop: 20,
  },
});
