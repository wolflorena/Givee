import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";

import CustomButton from "./CustomButton";
import { ThemeContext } from "./ThemeContext";

export default function DonationForm(props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
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
        confirmText="OK"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
        }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: theme === "dark" ? "#eaebed" : "#1f1f1f" }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <TextInput
        value={amount}
        style={styles.input}
        placeholder={`Amount of ${props.product}`}
        placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
        autoCapitalize="none"
        onChangeText={(text) => setAmount(text)}
      ></TextInput>
      <TextInput
        value={description}
        style={[styles.input, styles.secondInput]}
        placeholder={`${props.product} Description`}
        placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
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

const getStyles = (theme) =>
  StyleSheet.create({
    input: {
      marginVertical: 15,
      height: 50,
      borderWidth: 1,
      borderRadius: 15,
      padding: 10,
      width: 350,
      borderColor: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
      color: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
      fontSize: 20,
    },
    secondInput: {
      height: 150,
      paddingTop: 15,
      marginBottom: 20,
    },
  });
