import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useLoginContext } from "./LoginContext";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";

export default function Home() {
  const { currentUser } = useLoginContext();
  const navigation = useNavigation();

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
      <Text style={styles.welcomeMessage}>
        Welcome{"\n"}
        <Text style={styles.welcomeName}>{currentUser.fullName}!</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: "#1f1f1f",
    flex: 1,
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
