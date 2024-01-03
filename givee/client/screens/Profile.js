import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faInfo,
  faClockRotateLeft,
  faCommentDots,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Navbar from "../Navbar";
import { useLoginUpdateContext } from "../LoginContext";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export default function Profile() {
  const navigation = useNavigation();
  const { userLoggedOut } = useLoginUpdateContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const [selectedOption, setSelectedOption] = useState("");
  const auth = FIREBASE_AUTH;

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("myProfileIsPressed");
    }, [])
  );

  const handleLogout = () => {
    userLoggedOut();
    auth.signOut();
    navigation.navigate("Login");
  };

  const renderOption = (faIcon, label, path) => {
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => {
          setSelectedOption(label);
          if (label === "Log Out") {
            handleLogout();
          } else {
            navigation.navigate(`${path}`);
          }
          setSelectedOption("");
        }}
      >
        <FontAwesomeIcon
          style={[
            styles.optionIcon,
            label === selectedOption ? styles.selected : null,
          ]}
          icon={faIcon}
          size={20}
        />
        <Text
          style={[
            styles.optionLabel,
            label === selectedOption ? styles.selected : null,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faCircleUser} size={150} style={styles.icon} />
      <View style={styles.options}>
        {renderOption(faInfo, "About us", "AboutUs")}
        {renderOption(faClockRotateLeft, "My Donations", "History")}
        {renderOption(faCommentDots, "Contact Us", "Chat")}
        {renderOption(faGear, "Settings", "Settings")}
        {renderOption(faRightFromBracket, "Log Out", "Login")}
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    color: "#ddb31b",
    marginTop: 200,
  },
  options: {
    marginTop: 50,
    width: 200,
    gap: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  optionContainer: {
    width: 200,
    gap: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  optionLabel: {
    color: "#eaebed",
    fontSize: 25,
  },
  optionIcon: {
    color: "#eaebed",
  },
  selected: {
    color: "#ddb31b",
  },
});
