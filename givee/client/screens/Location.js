import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import { StatusBar } from "react-native";
import GoBackButton from "../GoBackButton";
import CustomButton from "../CustomButton";
import Title from "../Title";
import { useLoginContext } from "../LoginContext";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as ExpoLocation from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";

export default function Location({ route }) {
  let formData = route.params;
  const [centersData, setCentersData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const { currentUser } = useLoginContext();
  const navigation = useNavigation();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCurrentLocationAsync();
    getCenters();
  }, []);

  const getCenters = useCallback(async () => {
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "centers"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().type.includes(formData.type)) {
          const centerData = { id: doc.id, ...doc.data() };

          centerData.distance = calculateDistance(
            currentLocation.latitude,
            currentLocation.longitude,
            centerData.latitude,
            centerData.longitude
          );

          data.push(centerData);
        }
      });

      data.sort((a, b) => parseFloat(b.distance) - parseFloat(a.distance));

      setCentersData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const submitDonation = async () => {
    try {
      const donationData = {
        ...formData,
        centerId: selectedCenter,
        userEmail: currentUser.email,
        status: "pending",
        timestamp: serverTimestamp(),
      };

      const newDonationRef = doc(collection(FIREBASE_DB, "donations"));
      await setDoc(newDonationRef, donationData);

      console.log("Donation submitted successfully!");
      navigation.navigate("SuccessfulDonation");
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  const getCurrentLocationAsync = useCallback(async () => {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    const location = await ExpoLocation.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (angle) => (Math.PI / 180) * angle;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <GoBackButton />
      <Title text="Location" />
      <View style={styles.centersContent}>
        <View style={styles.centers}>
          {centersData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require("../../assets/noCenters.png")}
                style={styles.emptyImage}
              />
              <Text style={styles.emptyText}>No centers. 🙁</Text>
            </View>
          ) : (
            <View style={styles.containerSmall}>
              <FlatList
                data={centersData}
                keyExtractor={(center) => center.id}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.centerCard,
                        item.id === selectedCenter ? styles.selected : null,
                      ]}
                      onPress={() => {
                        setSelectedCenter(
                          selectedCenter === item.id ? "" : item.id
                        );
                      }}
                    >
                      <View style={styles.centerData}>
                        <View style={styles.firstSectionData}>
                          <Text style={styles.centerField}>
                            <Text style={{ fontWeight: "bold" }}>
                              Address {"\n"}
                            </Text>
                            {item.address}
                          </Text>
                          <Text style={styles.centerField}>
                            <Text style={{ fontWeight: "bold" }}>
                              Phone {"\n"}
                            </Text>
                            {item.phone}
                          </Text>
                        </View>
                        <View style={styles.secondSectionData}>
                          <Text style={styles.centerField}>
                            <Text style={{ fontWeight: "bold" }}>
                              {calculateDistance(
                                currentLocation.latitude,
                                currentLocation.longitude,
                                item.latitude,
                                item.longitude
                              )}{" "}
                              km
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {selectedCenter && selectedCenter === item.id && (
                      <View style={styles.mapContainer}>
                        <MapView
                          style={styles.map}
                          initialRegion={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03,
                          }}
                          provider="google"
                        >
                          <Marker
                            coordinate={{
                              latitude: item.latitude,
                              longitude: item.longitude,
                            }}
                          >
                            <Callout style={styles.calloutContainer}>
                              <Text>{item.address}</Text>
                            </Callout>
                          </Marker>

                          <Marker
                            pinColor="black"
                            coordinate={{
                              latitude: currentLocation.latitude,
                              longitude: currentLocation.longitude,
                            }}
                          >
                            <Callout style={styles.calloutContainer}>
                              <Text>You</Text>
                            </Callout>
                          </Marker>
                        </MapView>
                      </View>
                    )}
                  </View>
                )}
              ></FlatList>
              <CustomButton
                text="Donate"
                size="large"
                onPress={submitDonation}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    flex: 1,
  },
  emptyContainer: {
    width: 350,
    height: 600,
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
  },
  containerSmall: {
    flex: 1,
  },
  emptyImage: {
    height: 250,
    width: 250,
  },
  emptyText: {
    color: "#DDB31B",
    fontSize: 25,
  },
  centersContent: {
    justifyContent: "space-between",
    height: 600,
    width: 380,
    paddingHorizontal: 15,
  },
  centers: {
    height: 600,
    width: 350,
  },
  centerCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 120,
    width: 350,
    padding: 5,
    justifyContent: "center",
  },
  centerField: {
    fontSize: 15,
  },
  centerData: {
    height: 120,
    width: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selected: {
    backgroundColor: "#ddb31b",
  },
  firstSectionData: {
    height: 120,
    width: 250,
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    width: 350,
    height: 300,
    marginVertical: 10,
  },
});
