import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
} from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_AUTH } from "../../firebaseConfig";
import { ThemeContext } from "../ThemeContext";
import CustomButton from "../CustomButton";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showNoAccountAlert, setshowNoAccountAlert] = useState(false);
  const [showInvalidEmail, setShowInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
        confirmText="OK"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
        }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: theme === "dark" ? "#eaebed" : "#1f1f1f" }}
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
        confirmText="OK"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
        }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: theme === "dark" ? "#eaebed" : "#1f1f1f" }}
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
        confirmText="OK"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
        }}
        titleStyle={{ color: theme === "dark" ? "#eaebed" : "#1f1f1f" }}
        onConfirmPressed={() => {
          setShowInvalidEmail(false);
        }}
      />
      <View>
        <Image
          style={styles.logo}
          source={
            theme === "dark"
              ? require("../../assets/LogoLight.png")
              : require("../../assets/LogoDark.png")
          }
        ></Image>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.text, styles.firstText]}>
          Change your <Text style={{ color: "#ddb31b" }}>password!</Text>
        </Text>
        <Text style={[styles.text, styles.secondText]}>
          Write down your email address.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
      </View>

      <CustomButton text="Submit" onPress={resetPassword} />

      <View style={styles.loginContainer}>
        <Text
          style={[styles.text, { color: "#ddb31b" }]}
          onPress={() => navigation.navigate("Login")}
        >
          Login here
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    logo: {
      width: 250,
      height: 100,
      resizeMode: "stretch",
      marginBottom: 30,
    },
    textContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 80,
    },
    text: {
      fontSize: 15,
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
    },
    firstText: {
      fontSize: 35,
    },
    secondText: {
      fontSize: 20,
    },
    inputContainer: {
      width: "80%",
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 15,
      padding: 10,
      borderColor: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
      color: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
    },
    loginContainer: {
      position: "absolute",
      bottom: 50,
    },
  });
