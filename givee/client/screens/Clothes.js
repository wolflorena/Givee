import React from "react";
import { View, StyleSheet } from "react-native";
import NavBar from "../Navbar";
import Title from "../Title";
import DonationForm from "../DonationForm";
import GoBackButton from "../GoBackButton";

export default function Clothes() {
  return (
    <View style={styles.container}>
      <GoBackButton />
      <Title text="Donate clothes" />
      <DonationForm product="clothes" />
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
});
