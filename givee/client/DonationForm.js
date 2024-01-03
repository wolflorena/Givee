import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import CustomButton from "./CustomButton";

export default function DonationForm(props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const type = props.product;
  const navigation = useNavigation();

  return (
    <View>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="All fields are required"
        message="Please fill in all the fields."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
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
          if (amount && description) {
            const formData = { amount, description, type };
            navigation.navigate("Location", formData);
          } else {
            setShowAlert(true);
          }
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
