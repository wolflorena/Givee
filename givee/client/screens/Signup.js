import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../CustomButton";
import AwesomeAlert from "react-native-awesome-alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [showInvalidEmailAlert, setshowInvalidEmailAlert] = useState(false);
  const [showMissingFieldAlert, setshowMissingFieldAlert] = useState(false);
  const [showWeakPassword, setshowWeakPassword] = useState(false);
  const [showEmailAlreadyUsedAlert, setshowEmailAlreadyUsedAlert] =
    useState(false);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation();

  const signUp = () => {
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
      })
      .catch((error) => {
        if (error.code == "auth/invalid-email") setshowInvalidEmailAlert(true);
        if (error.code == "auth/weak-password") setshowWeakPassword(true);
        if (error.code == "auth/email-already-in-use")
          setshowEmailAlreadyUsedAlert(true);
        else alert(error.code);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <AwesomeAlert
        show={showInvalidEmailAlert}
        showProgress={false}
        title="Invalid email"
        message="Please type in a valid email address"
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
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#eaebed" }}
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
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
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
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setshowEmailAlreadyUsedAlert(false);
        }}
      />
      <View>
        <Image
          style={styles.logo}
          source={require("../../assets/LogoLight.png")}
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
          placeholderTextColor={"#a6a6a6"}
          autoCapitalize="none"
          onChangeText={(text) => setFullName(text)}
        ></TextInput>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Enter Email Address"
          placeholderTextColor={"#a6a6a6"}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor={"#a6a6a6"}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
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
    color: "#eaebed",
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
    borderColor: "#a6a6a6",
    color: "#a6a6a6",
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
