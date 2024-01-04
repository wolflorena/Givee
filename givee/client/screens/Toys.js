import React, { useContext } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Title from "../Title";
import DonationForm from "../DonationForm";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import { useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";

export default function Toys() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      flex: 1,
    },
  });
