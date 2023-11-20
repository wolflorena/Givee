import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const BUTTON_SIZES = {
  small: {
    width: 80,
    height: 25,
    marginTop: 70,
    marginBottom: 50,
  },
  large: {
    width: 350,
    height: 50,
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
