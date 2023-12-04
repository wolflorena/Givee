import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faHouse } from "@fortawesome/free-solid-svg-icons/faHouse";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

import { useNavigation } from "@react-navigation/native";

import { useAdminContext, useAdminUpdateContext } from "./AdminContext";

export default function Navbar() {
  const navigation = useNavigation();

  const { navBarButtons } = useAdminContext();
  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  const renderNavbarButton = (buttonType, faIcon, label) => {
    const isPressed = navBarButtons[buttonType];

    return (
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => {
          navBarButtonsPressHandler(buttonType);
          navigation.navigate(`Admin${label}`);
        }}
      >
        <FontAwesomeIcon
          style={[styles.navbarIcon, isPressed && { color: "#ddb31b" }]}
          icon={faIcon}
          size={20}
        />
        <Text style={[styles.navbarText, isPressed && { color: "#ddb31b" }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.navbar}>
      {renderNavbarButton("homeIsPressed", faHouse, "Home")}
      {renderNavbarButton("usersIsPressed", faUser, "Users")}
      {renderNavbarButton("donationsIsPressed", faBox, "Donations")}
      {renderNavbarButton("centersIsPressed", faBuilding, "Centers")}
      {renderNavbarButton("campaignsIsPressed", faHeart, "Campaigns")}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    marginBottom: 25,
    height: 50,
    width: 350,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navbarText: {
    fontSize: 10,
    color: "#eaebed",
  },
  navbarIcon: {
    marginBottom: 5,
    color: "#eaebed",
  },
  navbarButton: {
    alignItems: "center",
  },
});
