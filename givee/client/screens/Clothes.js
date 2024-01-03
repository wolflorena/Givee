import React from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import DonationForm from "../DonationForm";
import GoBackButton from "../GoBackButton";
import NavBar from "../Navbar";
import Title from "../Title";
import { useLoginUpdateContext } from "../LoginContext";

export default function Clothes() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("clothesIsPressed");
    }, [])
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <GoBackButton />
      <Title text="Donate clothes" />
      <DonationForm product="clothes" />
      <NavBar style={styles.nav} />
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
