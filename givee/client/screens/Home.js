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

  return (
    <View style={styles.container}>
      <View>
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
        <View style={styles.messageContainer}>
          <Text style={styles.welcomeMessage}>
            Welcome{"\n"}
            <Text style={styles.welcomeName}>{currentUser.fullName}!</Text>
          </Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.selectionContainer}
            onPress={() => {
              navBarButtonsPressHandler("clothesIsPressed");
              navigation.navigate("Clothes");
            }}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/clothes.png")}
            ></Image>
            <Text style={styles.logoText}>Donate clothes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionContainer}
            onPress={() => {
              navBarButtonsPressHandler("foodIsPressed");
              navigation.navigate("Food");
            }}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/food.png")}
            ></Image>
            <Text style={styles.logoText}>Donate food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionContainer}
            onPress={() => {
              navBarButtonsPressHandler("toysIsPressed");
              navigation.navigate("Toys");
            }}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/toys.png")}
            ></Image>
            <Text style={styles.logoText}>Donate toys</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.selectionContainer}
            onPress={() => {
              navBarButtonsPressHandler("historyIsPressed");
              navigation.navigate("History");
            }}
          >
            <Image
              style={styles.logo}
              source={require("../../assets/history.png")}
            ></Image>
            <Text style={styles.logoText}>My Donations</Text>
          </TouchableOpacity>
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
  goBackIcon: {
    color: "#eaebed",
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
  icon: {
    resizeMode: "stretch",
    width: 50,
    height: 50,
  },
  navbar: {
    position: "absolute",
    bottom: 25,
    left: 30,
  },
});
