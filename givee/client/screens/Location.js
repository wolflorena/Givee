import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as ExpoLocation from "expo-location";
import Svg, { Ellipse } from "react-native-svg";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_DB } from "../../firebaseConfig";
import GoBackButton from "../GoBackButton";
import CustomButton from "../CustomButton";
import Title from "../Title";
import { useLoginContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";
import Navbar from "../Navbar";

export default function Location({ route }) {
  let formData = route.params;
  const [centersData, setCentersData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useLoginContext();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCurrentLocationAsync();
    getCenters();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getCurrentLocationAsync();
      getCenters();
    }, [])
  );

  const getCenters = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  });

  const submitDonation = async () => {
    setLoading(true);
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

      setLoading(false);
      navigation.navigate("SuccessfulDonation");
    } catch (error) {
      setLoading(false);
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

  const icon = () => {
    return (
      <Svg height={20} width={20}>
        <Ellipse
          cx="10"
          cy="10"
          rx="10"
          ry="10"
          fill="blue"
          stroke="#fff"
          strokeWidth="2"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
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
              <View style={styles.yellowTextContainer}>
                <Text style={styles.yellowMessage}>
                  No centers are currently seeking the items you're offering to
                  donate. 😔
                </Text>
              </View>

              <View style={styles.whiteTextContainer}>
                <Text style={styles.whiteText}>
                  Please consider checking other types of donations. Thank you
                  for your willingness to help! ❤️
                </Text>
              </View>
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
                        if (selectedCenter === item.id) {
                          setSelectedCenter("");
                          setLoading(false);
                        } else {
                          setSelectedCenter(item.id);
                          setLoading(true);
                        }
                      }}
                    >
                      <View style={styles.centerData}>
                        <View style={styles.firstSectionData}>
                          <Text style={styles.centerField}>
                            <FontAwesomeIcon
                              style={styles.donationIcon}
                              icon={faLocationDot}
                              size={15}
                            />
                            <Text style={{ fontWeight: "bold" }}>
                              Address {"\n"}
                            </Text>
                            {item.address}
                          </Text>
                          <Text style={styles.centerField}>
                            <FontAwesomeIcon
                              style={styles.donationIcon}
                              icon={faPhone}
                              size={15}
                            />
                            <Text style={{ fontWeight: "bold" }}>
                              {" "}
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
                          onMapLoaded={() => setLoading(false)}
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
                            coordinate={{
                              latitude: currentLocation.latitude,
                              longitude: currentLocation.longitude,
                            }}
                          >
                            <View>{icon()}</View>
                            <Callout style={styles.calloutContainer}>
                              <Text>You are here</Text>
                            </Callout>
                          </Marker>
                        </MapView>
                      </View>
                    )}
                  </View>
                )}
              ></FlatList>
            </View>
          )}
        </View>
        {centersData.length !== 0 ? (
          <CustomButton text="Donate" size="large" onPress={submitDonation} />
        ) : (
          ""
        )}
      </View>

      {centersData.length === 0 ? <Navbar /> : ""}
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
    customMarker: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "blue",
    },
    emptyContainer: {
      paddingHorizontal: 25,
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    containerSmall: {
      flex: 1,
    },
    emptyImage: {
      resizeMode: "stretch",
      width: 250,
      height: 250,
      marginBottom: 40,
    },
    yellowMessage: {
      fontSize: 20,
      color: "#ddb31b",
      textAlign: "center",
    },
    yellowTextContainer: {
      width: 320,
      justifyContent: "center",
      marginBottom: 20,
    },
    whiteText: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 15,
      textAlign: "center",
    },
    whiteTextContainer: {
      width: 300,
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
      backgroundColor: "#a6a6a6",
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
