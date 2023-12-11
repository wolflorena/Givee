import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { useLoginUpdateContext } from "../LoginContext";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTshirt,
  faAppleWhole,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Navbar from "../Navbar";
import { useFocusEffect } from "@react-navigation/native";

export default function AboutUs() {
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("");
    }, [])
  );

  const openFacebookPage = () => {
    const url = "https://www.facebook.com/lorena.wolf.79";

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openTwitterPage = () => {
    const url = "https://www.twitter.com/";

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  const openInstagramPage = () => {
    const url = "https://www.instagram.com/wolflorena";

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to GIVEE</Text>
      <Text style={styles.text}>
        A dedicated platform that simplifies the act of giving. In a world where
        resources can be unevenly distributed, our app bridges the gap between
        those who want to give and those in need.
      </Text>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faTshirt} size={24} style={styles.icon} />
        <FontAwesomeIcon icon={faAppleWhole} size={24} style={styles.icon} />
        <FontAwesomeIcon icon={faPuzzlePiece} size={24} style={styles.icon} />
      </View>
      <Text style={styles.text}>
        Our app serves as a comprehensive guide for finding donation centers
        based on specific needs – be it clothes, food, or toys. We recognize
        that each donation type holds its unique significance and cater to this
        diversity. Whether you're decluttering your wardrobe, sharing surplus
        food, or passing on cherished toys, we connect you with the right place
        to donate.
      </Text>
      <Text style={[styles.text, styles.footerText]}>Contact us on: </Text>
      <View style={styles.footer}>
        <TouchableOpacity onPress={openFacebookPage}>
          <FontAwesomeIcon
            icon={faFacebook}
            size={24}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openTwitterPage}>
          <FontAwesomeIcon
            icon={faTwitter}
            size={24}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openInstagramPage}>
          <FontAwesomeIcon
            icon={faInstagram}
            size={24}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 20,
  },
  headerText: {
    color: "#ddb31b",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    color: "#eaebed",
    fontSize: 16,
    textAlign: "justify",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 10,
  },
  icon: {
    color: "#ddb31b",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "60%",
    paddingTop: 20,
    paddingBottom: 20,
  },
  socialIcon: {
    color: "#eaebed",
    marginHorizontal: 10,
  },
  footerText: {
    paddingTop: 20,
    fontSize: 18,
  },
});
