import React from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Title from "../Title";
import DonationForm from "../DonationForm";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import { useLoginUpdateContext } from "../LoginContext";

export default function Toys() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("toysIsPressed");
    }, [])
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <GoBackButton />

      <Title text="Donate Toys" />
      <DonationForm product="toys" />
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
