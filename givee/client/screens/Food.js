import React from "react";
import { View, StyleSheet } from "react-native";
import Title from "../Title";
import DonationForm from "../DonationForm";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import { useLoginUpdateContext } from "../LoginContext";
import { useFocusEffect } from "@react-navigation/native";

export default function Food() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("foodIsPressed");
    }, [])
  );

  return (
    <View style={styles.container}>
      <GoBackButton />

      <Title text="Donate Food" />
      <DonationForm product="food" />
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
