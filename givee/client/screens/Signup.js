import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const auth = FIREBASE_AUTH;

  const navigation = useNavigation();

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user.email);
        setFullName("");
        setEmail("");
        setPassword("");
        navigation.navigate("Login");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={signUp}>
          <Text>Sign up</Text>
        </TouchableOpacity>
      </View>

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
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ddb31b",
    width: 100,
    height: 30,
    borderRadius: 15,
    marginTop: 70,
    marginBottom: 50,
  },
  loginContainer: {
    width: 300,
    justifyContent: "space-between",
    flexDirection: "row",
    position: "absolute",
    bottom: 50,
  },
});
