import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useLoginContext, useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";
import Navbar from "../Navbar";

export default function Home() {
  const { currentUser } = useLoginContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("homeIsPressed");
    }, [])
  );

  const renderContainer = (
    buttonType,
    image,
    label,
    message,
    color,
    colorCircle
  ) => {
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
        style={[styles.selectionContainer, { backgroundColor: color }]}
        onPress={() => {
          navBarButtonsPressHandler(buttonType);
          navigation.navigate(`${label}`);
        }}
      >
        <View style={[styles.circle, { backgroundColor: colorCircle }]}>
          <Image style={styles.logo} source={imagePath}></Image>
        </View>
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
            "Donate clothes",
            "#F4E096",
            "#E1DCC9"
          )}
          {renderContainer(
            "foodIsPressed",
            "food.png",
            "Food",
            "Donate food",
            "#94BDB4",
            "#779891"
          )}
          {renderContainer(
            "toysIsPressed",
            "toys.png",
            "Toys",
            "Donate toys",
            "#C4C58B",
            "#9FA064"
          )}
          {renderContainer(
            "historyIsPressed",
            "history.png",
            "History",
            "My donations",
            "#E7A561",
            "#3E2C00"
          )}
        </View>
      </View>

      <Navbar />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 25,
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      flex: 1,
    },
    welcomeMessage: {
      marginTop: 20,
      fontSize: 20,
      color: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
    },
    welcomeName: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
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
      width: 155,
      height: 155,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15,
      gap: 10,
      borderColor: theme === "dark" ? "" : "#1f1f1f",
      borderWidth: 0.2,
    },
    logo: {
      resizeMode: "stretch",
      width: 50,
      height: 50,
    },
    logoText: {
      fontSize: 15,
    },
    circle: {
      borderRadius: 50,
      height: 75,
      width: 75,
      justifyContent: "center",
      alignItems: "center",
    },
  });
