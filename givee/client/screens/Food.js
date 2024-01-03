import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import DonationForm from "../DonationForm";
import GoBackButton from "../GoBackButton";
import NavBar from "../Navbar";
import Title from "../Title";
import { useLoginUpdateContext } from "../LoginContext";

export default function Food() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("foodIsPressed");
    }, [])
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <GoBackButton />

      <Title text="Donate Food" />
      <DonationForm product="food" />
      <NavBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    flex: 1,
  },
});
