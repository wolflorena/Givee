import React, { useContext } from "react";
import { View, Image, StyleSheet, Text } from "react-native";

import Navbar from "../Navbar";
import { ThemeContext } from "../ThemeContext";

export default function SuccessfulDonation() {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 25,
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
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
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 15,
      textAlign: "center",
    },
    whiteTextContainer: {
      width: 300,
      marginTop: 20,
    },
  });
