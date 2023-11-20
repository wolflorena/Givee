import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";

export default function DonationForm(props) {
  return (
    <View styles={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={`Amount of ${props.product}`}
        placeholderTextColor={"#a6a6a6"}
        autoCapitalize="none"
      ></TextInput>
      <TextInput
        style={[styles.input, styles.secondInput]}
        placeholder={`${props.product} Description`}
        placeholderTextColor={"#a6a6a6"}
        autoCapitalize="none"
        multiline
      ></TextInput>

      <CustomButton text="Next" size="large" onPress={() => alert("...")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    flex: 1,
  },
  input: {
    marginVertical: 15,
    height: 50,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: 350,
    borderColor: "#a6a6a6",
    color: "#a6a6a6",
    fontSize: 20,
  },
  secondInput: {
    height: 150,
    marginBottom: 300,
    paddingTop: 15,
  },
});
