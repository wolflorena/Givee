import React from "react";
import { View, StyleSheet } from "react-native";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";

export default function Centers() {
  return (
    <View style={styles.container}>
      <GoBackButton />

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
});
