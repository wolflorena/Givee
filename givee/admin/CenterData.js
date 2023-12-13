import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { faFootball } from "@fortawesome/free-solid-svg-icons/faFootball";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function CenterData({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [centerData, setCenterData] = useState([]);

  const centerId = route.params ? route.params.centerId : null;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCenter();
  }, [centerData]);

  const getCenter = useCallback(async () => {
    try {
      const docRef = doc(db, "centers", centerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCenterData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const renderDonationType = (type, index, styles) => (
    <View key={index}>
      {type === "toys" && (
        <View style={styles.centerData}>
          <FontAwesomeIcon
            style={styles.centerIcon}
            icon={faFootball}
            size={20}
          />
          <Text style={styles.centerText}>Toys</Text>
        </View>
      )}

      {type === "clothes" && (
        <View style={styles.centerData}>
          <FontAwesomeIcon style={styles.centerIcon} icon={faShirt} size={20} />
          <Text style={styles.centerText}>Clothes</Text>
        </View>
      )}

      {type === "food" && (
        <View style={styles.centerData}>
          <FontAwesomeIcon
            style={styles.centerIcon}
            icon={faUtensils}
            size={20}
          />
          <Text style={styles.centerText}>Food</Text>
        </View>
      )}
    </View>
  );

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
      <View style={styles.centerContent}>
        <View style={styles.centerData}>
          <FontAwesomeIcon
            style={styles.centerIcon}
            icon={faMapPin}
            size={20}
          />
          <Text style={styles.centerText}>{centerData.address}</Text>
        </View>
        <View style={styles.centerData}>
          <FontAwesomeIcon style={styles.centerIcon} icon={faPhone} size={20} />
          <Text style={styles.centerText}>{centerData.phone}</Text>
        </View>
        <View style={styles.donationType}>
          {centerData.type &&
            centerData.type.map((type, index) =>
              renderDonationType(type, index, styles)
            )}
        </View>

        {centerData.latitude && centerData.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: centerData.latitude,
                longitude: centerData.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
              provider="google"
            >
              <Marker
                coordinate={{
                  latitude: centerData.latitude,
                  longitude: centerData.longitude,
                }}
              ></Marker>
            </MapView>
          </View>
        )}
      </View>
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
  centerContent: {
    height: 750,
    width: 350,
    paddingVertical: 20,
  },
  centerIcon: {
    color: "#ddb31b",
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
  centerText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 15,
  },
  centerData: {
    flexDirection: "row",
    marginVertical: 10,
    marginRight: 20,
  },
  donationType: {
    flexDirection: "row",
  },
  dayProgram: {
    marginVertical: 5,
  },
  openProgram: {
    marginTop: 40,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    width: 350,
    height: 500,
    marginTop: 30,
  },
});
