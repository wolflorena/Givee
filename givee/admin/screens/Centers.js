import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { collection, query, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

import { useAdminUpdateContext } from "../AdminContext";
import NavBar from "../Navbar";

export default function Centers() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [centersData, setCentersData] = useState([]);
  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCenters();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("centersIsPressed");
    }, [])
  );

  const getCenters = useCallback(async () => {
    try {
      const q = query(collection(db, "centers"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setCentersData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const viewCenterDataHandler = (centerId) => {
    navigation.navigate("CenterData", { centerId });
  };

  const addCenterHandler = () => {
    navigation.navigate("CenterForm");
  };

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
      <View style={styles.centersContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Centers</Text>
          <TouchableOpacity onPress={() => addCenterHandler()}>
            <FontAwesomeIcon
              style={styles.addCenterIcon}
              icon={faPlus}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centers}>
          <FlatList
            keyExtractor={(center) => center.id}
            data={centersData}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.centerCard}
                onPress={() => viewCenterDataHandler(item.id)}
              >
                <FontAwesomeIcon
                  style={styles.centerIcon}
                  icon={faMapPin}
                  size={30}
                />
                <View style={styles.centerData}>
                  <Text style={styles.centerField}>
                    <Text style={{ fontWeight: "bold" }}>Address {"\n"}</Text>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
        </View>
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
  centersContent: {
    justifyContent: "space-between",
    height: 680,
    width: 380,
    padding: 15,
  },
  pageTitle: {
    color: "#ddb31b",
    fontWeight: "bold",
    fontSize: 25,
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
  centers: {
    marginVertical: 10,
    height: 620,
    width: 350,
  },
  centerCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 70,
    width: 350,
  },
  centerIcon: {
    color: "#ddb31b",
    marginHorizontal: 15,
  },
  centerField: {
    fontSize: 15,
  },
  centerData: {
    height: 70,
    width: 250,
    justifyContent: "space-evenly",
  },
  addCenterIcon: {
    color: "#ddb31b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
