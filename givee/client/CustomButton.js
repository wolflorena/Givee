import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const BUTTON_SIZES = {
  small: {
    width: 100,
    height: 30,
    marginTop: 70,
    marginBottom: 20,
  },
  little: {
    width: 100,
    height: 30,
  },
  large: {
    width: 350,
    height: 50,
  },
  medium: {
    width: 150,
    height: 30,
  },
  auto: {
    with: "auto",
    height: "auto",
  },
};

const TEXT_SIZES = {
  small: {
    fontSize: 15,
  },
  large: {
    fontSize: 20,
  },
};

export default function CustomButton({ text, size, onPress }) {
  const buttonStyle = BUTTON_SIZES[size] || BUTTON_SIZES.small;
  const textStyle = TEXT_SIZES[size] || TEXT_SIZES.small;

  return (
    <View style={[styles.buttonContainer, buttonStyle]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddb31b",
    borderRadius: 15,
  },
});
