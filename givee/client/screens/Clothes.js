import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import DonationForm from "../DonationForm";
import GoBackButton from "../GoBackButton";
import NavBar from "../Navbar";
import Title from "../Title";
import { useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";

export default function Clothes() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("clothesIsPressed");
    }, [])
  );

  return (
    <View style={styles.container} behavior="height">
      <GoBackButton />
      <Title text="Donate clothes" />
      <DonationForm product="clothes" />
      <NavBar style={styles.nav} />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      flex: 1,
    },
  });
