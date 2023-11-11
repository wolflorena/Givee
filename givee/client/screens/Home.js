import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useLoginContext, useLoginUpdateContext } from "../LoginContext";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import Navbar from "../Navbar";

export default function Home() {
  const { currentUser } = useLoginContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  const navigation = useNavigation();

  const renderContainer = (buttonType, image, label, message) => {
    let imagePath;
    switch (image) {
      case "clothes.png":
        imagePath = require("../../assets/clothes.png");
        break;
      case "food.png":
        imagePath = require("../../assets/food.png");
        break;
      case "toys.png":
        imagePath = require("../../assets/toys.png");
        break;
      case "history.png":
        imagePath = require("../../assets/history.png");
        break;
      default:
        console.error(`Image not recognized: ${image}`);
        imagePath = require("../../assets/LogoDark.png");
    }
    return (
      <TouchableOpacity
        style={styles.selectionContainer}
        onPress={() => {
          navBarButtonsPressHandler(buttonType);
          navigation.navigate(`${label}`);
        }}
      >
        <Image style={styles.logo} source={imagePath}></Image>
        <Text style={styles.logoText}>{message}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity style={styles.goBackButton}></TouchableOpacity>
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeMessage}>
            Welcome{"\n"}
            <Text style={styles.welcomeName}>{currentUser.fullName}!</Text>
          </Text>
        </View>
        <View style={styles.menuContainer}>
          {renderContainer(
            "clothesIsPressed",
            "clothes.png",
            "Clothes",
            "Donate clothes"
          )}
          {renderContainer("foodIsPressed", "food.png", "Food", "Donate food")}
          {renderContainer("toysIsPressed", "toys.png", "Toys", "Donate toys")}
          {renderContainer(
            "historyIsPressed",
            "history.png",
            "History",
            "My donations"
          )}
        </View>
      </View>

      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    backgroundColor: "#1f1f1f",
    justifyContent: "space-between",
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
  menuContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionContainer: {
    backgroundColor: "green",
    width: 155,
    height: 155,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    gap: 10,
    backgroundColor: "#F4E096",
  },
  logo: {
    resizeMode: "stretch",
    width: 50,
    height: 50,
  },
  logoText: {
    fontSize: 15,
  },
  navbar: {
    position: "absolute",
    bottom: 25,
    left: 30,
  },
});
