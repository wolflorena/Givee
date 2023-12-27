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
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { useLoginUpdateContext } from "../LoginContext";
import CustomButton from "../CustomButton";
import AwesomeAlert from "react-native-awesome-alerts";

export default function Login() {
  const { userLoggedIn } = useLoginUpdateContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  const [email, setEmail] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [password, setPassword] = useState("");
  const auth = FIREBASE_AUTH;
  const db = FIREBASE_DB;

  const navigation = useNavigation();

  const signIn = () => {
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
        } else {
          setShowAlert(true);
        }
      })
      .catch((error) => setShowAlert(true));
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setShowAlert(false);
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
          placeholderTextColor={"#a6a6a6"}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"#a6a6a6"}
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
          onPress={() => navigation.navigate("Signup")}
        >
          Signup here
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
