import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";

import { updateDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import AwesomeAlert from "react-native-awesome-alerts";

import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";

export default function EditCenter({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const centerId = route.params ? route.params.centerId : null;

  const [showAlertEdit, setShowAlertEdit] = useState(false);

  const [centerData, setCenterData] = useState({
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
    type: [],
  });

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCenter();
  }, []);

  const getCenter = useCallback(async () => {
    try {
      const docRef = doc(db, "centers", centerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCenterData(docSnap.data());

        setCheckedClothes(docSnap.data().type.includes("clothes"));
        setCheckedToys(docSnap.data().type.includes("toys"));
        setCheckedFood(docSnap.data().type.includes("food"));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  const editCenterHandler = async () => {
    const centerRef = doc(db, "centers", centerId);
    await updateDoc(centerRef, centerData);
    navigation.navigate("AdminCenters");
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={showAlertEdit}
        showProgress={false}
        title="Confirm Edit"
        message="Save changes to this center?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText="Yes"
        cancelText="No"
        cancelButtonColor="rgba(210, 4, 45, 0.7)"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setShowAlertEdit(false);
          editCenterHandler();
        }}
        onCancelPressed={() => {
          setShowAlertEdit(false);
        }}
      />
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

          <View style={styles.openProgram}></View>
        </View>

        <View style={styles.editCenterButtonContainer}>
          <TouchableOpacity
            style={styles.editCenterButton}
            onPress={() => {
              setShowAlertEdit(true);
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Edit Center</Text>
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
  editCenterButton: {
    backgroundColor: "#ddb31b",
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    borderRadius: 10,
    fontSize: 15,
  },
  editCenterButtonContainer: {
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
});
