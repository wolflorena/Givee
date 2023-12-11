import React from "react";
import { View, StyleSheet } from "react-native";
import NavBar from "../Navbar";
import Title from "../Title";
import DonationForm from "../DonationForm";
import GoBackButton from "../GoBackButton";
import { useLoginUpdateContext } from "../LoginContext";
import { useFocusEffect } from "@react-navigation/native";

export default function Clothes() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("clothesIsPressed");
    }, [])
  );

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
