import { View, TextInput, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import CustomButton from "../CustomButton";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent");
        setEmail("");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <View style={styles.container}>
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
