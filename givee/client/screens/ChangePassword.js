import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import CustomButton from "../CustomButton";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showNoAccountAlert, setshowNoAccountAlert] = useState(false);
  const [showInvalidEmail, setShowInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const resetPassword = () => {
    setLoading(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        setShowSuccessAlert(true);
        setEmail("");
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.code == "auth/invalid-email" ||
          error.code == "auth/missing-email"
        )
          setShowInvalidEmail(true);
      });
  };
  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <AwesomeAlert
        show={showSuccessAlert}
        showProgress={false}
        title="Succes!"
        message="Password reset email sent"
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
          setShowSuccessAlert(false);
        }}
      />
      <AwesomeAlert
        show={showNoAccountAlert}
        showProgress={false}
        title="Invalid email"
        message="No account was found with this email"
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
          setshowNoAccountAlert(false);
        }}
      />
      <AwesomeAlert
        show={showInvalidEmail}
        showProgress={false}
        title="Invalid email format"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setShowInvalidEmail(false);
        }}
      />
      <View style={styles.inputContainer}>
        <Text style={[styles.text, styles.firstText]}>
          Write your email address
        </Text>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={"#a6a6a6"}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
      </View>

      <CustomButton
        text="Change Password"
        size="medium"
        onPress={resetPassword}
      />

      <View style={styles.loginContainer}>
        <Text
          style={[styles.text, { color: "#ddb31b" }]}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
    flex: 1,
  },
  inputContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  input: {
    marginVertical: 4,
    height: 40,
    width: 200,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    borderColor: "#a6a6a6",
    color: "#a6a6a6",
  },
  text: {
    color: "#eaebed",
    textAlign: "center",
    marginVertical: 5,
  },
  firstText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    position: "absolute",
    bottom: 50,
  },
});
