import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLoginContext } from "../../client/screens/LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { StatusBar } from "react-native";
import NavBar from "../Navbar";

export default function Home() {
  const { currentUser } = useLoginContext();
  const navigation = useNavigation();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.goBackButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon
          style={styles.goBackIcon}
          icon={faCircleChevronLeft}
          size={25}
        />
      </TouchableOpacity>
      <View style={styles.homeContent}>
        <Text style={styles.welcomeMessage}>
          Welcome{"\n"}
          <Text style={styles.welcomeName}>{currentUser.fullName}!</Text>
        </Text>
      </View>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  homeContent: {
    height: 680,
    width: 380,
    padding: 15,
  },
  welcomeMessage: {
    marginTop: 20,
    fontSize: 20,
    color: "#a6a6a6",
  },
  welcomeName: {
    color: "#eaebed",
    fontWeight: "bold",
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
});
