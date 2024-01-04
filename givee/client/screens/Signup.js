import React, { useState, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { ThemeContext } from "../ThemeContext";
import CustomButton from "../CustomButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [showInvalidEmailAlert, setshowInvalidEmailAlert] = useState(false);
  const [showMissingFieldAlert, setshowMissingFieldAlert] = useState(false);
  const [showWeakPassword, setshowWeakPassword] = useState(false);
  const [showEmailAlreadyUsedAlert, setshowEmailAlreadyUsedAlert] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation();

  const signUp = () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;

        const isAdmin = false;
        await setDoc(doc(db, "users", user.uid), {
          fullName: fullName,
          email: email,
          isAdmin: isAdmin,
        });

        setFullName("");
        setEmail("");
        setPassword("");
        navigation.navigate("Login");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        if (error.code == "auth/invalid-email") setshowInvalidEmailAlert(true);
        if (error.code == "auth/weak-password") setshowWeakPassword(true);
        if (error.code == "auth/email-already-in-use")
          setshowEmailAlreadyUsedAlert(true);
        else alert(error.code);
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
        show={showInvalidEmailAlert}
        showProgress={false}
        title="Invalid email"
        message="Please type in a valid email address"
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
          setshowInvalidEmailAlert(false);
        }}
      />
      <AwesomeAlert
        show={showMissingFieldAlert}
        showProgress={false}
        title="All the fields are required"
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
          setshowMissingFieldAlert(false);
        }}
      />
      <AwesomeAlert
        show={showWeakPassword}
        showProgress={false}
        title="Weak password"
        message="The password should have min. 6 characters"
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
          setshowWeakPassword(false);
        }}
      />
      <AwesomeAlert
        show={showEmailAlreadyUsedAlert}
        showProgress={false}
        title="Error"
        message="An account with this email already exists"
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
          setshowEmailAlreadyUsedAlert(false);
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
          Let's get you <Text style={{ color: "#ddb31b" }}>started!</Text>
        </Text>
        <Text style={[styles.text, styles.secondText]}>
          Let's create an account
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={fullName}
          style={styles.input}
          placeholder="Enter Fullname"
          placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
          autoCapitalize="none"
          onChangeText={(text) => setFullName(text)}
        ></TextInput>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Enter Email Address"
          placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
      </View>

      <CustomButton
        text="Sign up"
        onPress={() => {
          if (fullName && email && password) signUp();
          else setshowMissingFieldAlert(true);
        }}
      />

      <View style={styles.loginContainer}>
        <Text style={styles.text}>Have an account?</Text>
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
      marginBottom: 50,
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
      fontSize: 40,
    },
    secondText: {
      fontSize: 25,
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
    inputContainer: {
      width: "80%",
    },
    loginContainer: {
      width: 300,
      justifyContent: "space-between",
      flexDirection: "row",
      position: "absolute",
      bottom: 50,
    },
  });
