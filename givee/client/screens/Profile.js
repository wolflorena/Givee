import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCircleUser,
  faInfo,
  faClockRotateLeft,
  faCommentDots,
  faGear,
  faRightFromBracket,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Navbar from "../Navbar";
import { useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export default function Profile() {
  const navigation = useNavigation();
  const { userLoggedOut } = useLoginUpdateContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
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
        style={styles.optionButton}
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
        <View style={styles.optionContainer}>
          <View
            style={[
              styles.iconCircle,
              label === selectedOption ? styles.selectedCircle : null,
              label === "Log Out" ? styles.logoutCircle : null,
            ]}
          >
            <FontAwesomeIcon
              style={[
                styles.optionIcon,
                label === selectedOption ? styles.selected : null,
              ]}
              icon={faIcon}
              size={20}
            />
          </View>
          <Text
            style={[
              styles.optionLabel,
              label === selectedOption ? styles.selected : null,
            ]}
          >
            {label}
          </Text>
        </View>
        <FontAwesomeIcon
          style={[
            styles.optionLabel,
            label === selectedOption ? styles.selected : null,
          ]}
          icon={faChevronRight}
          size={20}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My profile</Text>
      <FontAwesomeIcon icon={faCircleUser} size={125} style={styles.icon} />
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      flex: 1,
    },
    title: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 30,
      marginTop: 100,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#ddb31b",
      justifyContent: "center",
      alignItems: "center",
    },
    logoutCircle: {
      backgroundColor: "#BB342F",
    },
    icon: {
      color: "#ddb31b",
      marginTop: 30,
    },
    options: {
      marginTop: 70,
      width: 200,
      gap: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    optionContainer: {
      width: 250,
      gap: 20,
      flexDirection: "row",
      alignItems: "center",
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionLabel: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 25,
    },
    optionIcon: {
      color: theme === "dark" ? "#1f1f1f" : "#eaebed",
    },
    selected: {
      color: "#ddb31b",
    },
  });
