import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";

import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export default function CenterForm() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [pin, setPin] = useState({
    latitude: 45.7538355,
    longitude: 21.2257474,
  });

  const [centerData, setCenterData] = useState({
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
    type: [],
  });

  const [checkedClothes, setCheckedClothes] = useState(false);
  const [checkedToys, setCheckedToys] = useState(false);
  const [checkedFood, setCheckedFood] = useState(false);

  useEffect(() => {
    const newSelectedTypes = [];

    if (checkedClothes) newSelectedTypes.push("clothes");
    if (checkedToys) newSelectedTypes.push("toys");
    if (checkedFood) newSelectedTypes.push("food");

    setCenterData((prevData) => ({
      ...prevData,
      type: newSelectedTypes,
    }));
  }, [checkedClothes, checkedToys, checkedFood]);

  const handleTypeSelection = (type) => {
    switch (type) {
      case "clothes":
        setCheckedClothes(!checkedClothes);
        break;
      case "toys":
        setCheckedToys(!checkedToys);
        break;
      case "food":
        setCheckedFood(!checkedFood);
        break;
      default:
        break;
    }
  };

  const addCenterHandler = async () => {
    try {
      const newCenterRef = doc(collection(db, "centers"));
      await setDoc(newCenterRef, centerData);
      navigation.navigate("AdminCenters");

      console.log("Center added successfully!");
    } catch (error) {
      console.error("Error added center:", error);
    }
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
      <View style={styles.centerForm}>
        <View>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.centerIcon}
              icon={faMapPin}
              size={20}
            />
            <TextInput
              value={centerData.address}
              style={styles.input}
              placeholder={"Center address"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(address) =>
                setCenterData({ ...centerData, address: address })
              }
            ></TextInput>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.centerIcon}
              icon={faPhone}
              size={20}
            />
            <TextInput
              value={centerData.phone}
              style={styles.input}
              placeholder={"Center phone number"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(phone) =>
                setCenterData({ ...centerData, phone: phone })
              }
            ></TextInput>
          </View>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Text style={styles.textCheckbox}>Clothes</Text>
              <Checkbox
                value={checkedClothes}
                onValueChange={() => handleTypeSelection("clothes")}
                color={checkedClothes ? "#ddb31b" : "#a6a6a6"}
              />
            </View>

            <View style={styles.checkbox}>
              <Text style={styles.textCheckbox}>Toys</Text>
              <Checkbox
                value={checkedToys}
                onValueChange={() => handleTypeSelection("toys")}
                color={checkedToys ? "#ddb31b" : "#a6a6a6"}
              />
            </View>

            <View style={styles.checkbox}>
              <Text style={styles.textCheckbox}>Food</Text>
              <Checkbox
                value={checkedFood}
                onValueChange={() => handleTypeSelection("food")}
                color={checkedFood ? "#ddb31b" : "#a6a6a6"}
              />
            </View>
          </View>

          <View style={styles.mapContainer}>
            <GooglePlacesAutocomplete
              styles={{
                container: {
                  flex: 0,
                  position: "absolute",
                  width: "100%",
                  zIndex: 1,
                },
              }}
              placeholder="Search"
              fetchDetails={true}
              GooglePlacesSearchQuery={{ rankby: "distance" }}
              onPress={(data, details = null) => {
                const newPin = {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                };

                setPin((prevPin) => ({
                  ...prevPin,
                  latitude: newPin.latitude,
                  longitude: newPin.longitude,
                }));

                setCenterData((prevData) => ({
                  ...prevData,
                  latitude: newPin.latitude,
                  longitude: newPin.longitude,
                }));
              }}
              query={{
                key: "AIzaSyBh4e7r-F87Yy5bbWVmG_jRJfL8dPabl2I",
                language: "en",
              }}
            />
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: pin.latitude,
                longitude: pin.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              provider="google"
            >
              <Marker
                coordinate={pin}
                draggable={true}
                onDragStart={(e) => {
                  console.log("Drag start", e.nativeEvent.coordinate);
                }}
                onDragEnd={(e) => {
                  const newPin = {
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  };

                  setPin((prevPin) => ({
                    ...prevPin,
                    latitude: newPin.latitude,
                    longitude: newPin.longitude,
                  }));

                  setCenterData((prevData) => ({
                    ...prevData,
                    latitude: newPin.latitude,
                    longitude: newPin.longitude,
                  }));
                }}
              ></Marker>
            </MapView>
          </View>
        </View>

        <View style={styles.addCenterButtonContainer}>
          <TouchableOpacity
            style={styles.addCenterButton}
            onPress={() => {
              addCenterHandler();
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Add Center</Text>
          </TouchableOpacity>
        </View>
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
  centerForm: {
    justifyContent: "space-between",
    height: 750,
    width: 380,
    padding: 15,
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
  addCenterButton: {
    backgroundColor: "#ddb31b",
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    borderRadius: 10,
    fontSize: 15,
  },
  addCenterButtonContainer: {
    alignItems: "center",
  },
  input: {
    marginBottom: 20,
    height: 35,
    width: 310,
    color: "#ffffff",
    fontSize: 15,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
  },
  textCheckbox: {
    marginRight: 10,
    fontSize: 15,
    color: "#ffffff",
  },
  checkboxContainer: {
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  checkbox: {
    flexDirection: "row",
    marginRight: 20,
  },
  inputContainer: {
    flexDirection: "row",
  },
  centerIcon: {
    marginTop: 12,
    marginRight: 10,
    color: "#ddb31b",
  },
  inputHour: {
    marginBottom: 20,
    height: 35,
    width: 100,
    color: "#ffffff",
    fontSize: 15,
    borderBottomColor: "#ffffff",
    borderBottomWidth: 1,
  },
  checkboxContainerProgram: {
    flexDirection: "row",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapContainer: {
    width: 350,
    height: 450,
    marginTop: 30,
  },
});
