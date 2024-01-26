import React, { useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons/faBowlFood";
import {
  faCircle,
  faUser,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";

import { useLoginContext, useLoginUpdateContext } from "./LoginContext";
import { ThemeContext } from "./ThemeContext";

export default function Navbar() {
  const navigation = useNavigation();
  const { navBarButtons } = useLoginContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const renderNavbarButton = (buttonType, faIcon, label) => {
    const isPressed = navBarButtons[buttonType];
    return (
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => {
          navBarButtonsPressHandler(buttonType);
          navigation.navigate(`${label}`);
        }}
      >
        <FontAwesomeIcon
          style={[styles.navbarIcon, isPressed && { color: "#ddb31b" }]}
          icon={faIcon}
          size={20}
        />
        {isPressed && (
          <FontAwesomeIcon
            style={[styles.navbarCircle, { color: "#ddb31b" }]}
            icon={faCircle}
            size={5}
          />
        )}
        <Text style={[styles.navbarText, isPressed && { color: "#ddb31b" }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.navbar}>
      {renderNavbarButton("homeIsPressed", faHouse, "Home")}
      {renderNavbarButton("clothesIsPressed", faShirt, "Clothes")}
      {renderNavbarButton("foodIsPressed", faBowlFood, "Food")}
      {renderNavbarButton("toysIsPressed", faPuzzlePiece, "Toys")}
      {renderNavbarButton("myProfileIsPressed", faUser, "Profile")}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    navbar: {
      marginBottom: 25,
      height: 20,
      width: 350,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      bottom: 0,
      position: "absolute",
    },
    navbarText: {
      fontSize: 10,
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
    },
    navbarIcon: {
      marginBottom: 5,
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
    },
    navbarButton: {
      alignItems: "center",
    },
  });
