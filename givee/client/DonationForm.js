import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";

export default function DonationForm(props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const type = props.product;
  const navigation = useNavigation();

  return (
    <View>
      <TextInput
        value={amount}
        style={styles.input}
        placeholder={`Amount of ${props.product}`}
        placeholderTextColor={"#a6a6a6"}
        autoCapitalize="none"
        onChangeText={(text) => setAmount(text)}
      ></TextInput>
      <TextInput
        value={description}
        style={[styles.input, styles.secondInput]}
        placeholder={`${props.product} Description`}
        placeholderTextColor={"#a6a6a6"}
        autoCapitalize="none"
        multiline
        onChangeText={(text) => setDescription(text)}
      ></TextInput>

      <CustomButton
        text="Next"
        size="large"
        onPress={() => {
          const formData = { amount, description, type };
          navigation.navigate("Location", formData);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 15,
    marginBottom: 20,
  },
});
