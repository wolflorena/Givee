import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";

import { ThemeContext } from "./ThemeContext";

export default function Title(props) {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.text}</Text>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      width: 380,
      padding: 15,
    },
    title: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 30,
    },
  });
