import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function Title(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 380,
    padding: 15,
  },
  title: {
    color: "#eaebed",
    fontSize: 30,
  },
});
