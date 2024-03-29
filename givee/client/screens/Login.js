import React, { useState, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from "react-native";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AwesomeAlert from "react-native-awesome-alerts";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../firebaseConfig";
import { useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";
import CustomButton from "../CustomButton";

export default function Login() {
  const { userLoggedIn } = useLoginUpdateContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation();

  const signIn = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const userRole = userData.isAdmin ? "admin" : "client";

          userLoggedIn(userData);
          if (userRole === "admin") {
            setEmail("");
            setPassword("");
            navigation.navigate("AdminHome");
          } else {
            setEmail("");
            setPassword("");
            navigation.navigate("Home");
            navBarButtonsPressHandler("homeIsPressed");
          }
          setLoading(false);
        } else {
          setLoading(false);
          setShowAlert(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setShowAlert(true);
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
        show={showAlert}
        showProgress={false}
        title="Wrong credentials"
        message="Email or password incorect"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
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
          Welcome <Text style={{ color: "#ddb31b" }}>back!</Text>
        </Text>
        <Text style={[styles.text, styles.secondText]}>
          Login to your account
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
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={theme === "dark" ? "#a6a6a6" : "#1f1f1f"}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
      </View>

      <View style={styles.loginContainer}>
        <CustomButton text="Login" onPress={signIn} />
        <Text
          style={styles.text}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          Forgot password?
        </Text>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.text}>Don't have an account?</Text>
        <Text
          style={[styles.text, { color: "#ddb31b" }]}
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          Signup here
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
    signupContainer: {
      width: 300,
      justifyContent: "space-between",
      flexDirection: "row",
      position: "absolute",
      bottom: 50,
    },
    loginContainer: {
      alignItems: "center",
    },
  });
