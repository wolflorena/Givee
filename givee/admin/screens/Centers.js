import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { collection, query, getDocs, doc, deleteDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons/faFaceFrown";
import AwesomeAlert from "react-native-awesome-alerts";

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

  const [showAlertDelete, setShowAlertDelete] = useState(false);

  const [selectedDonationId, setSelectedDonationId] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCenters();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("centersIsPressed");
      getCenters();
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

  const deleteCenterHandler = async (centerId) => {
    try {
      await deleteDoc(doc(db, "centers", centerId));

      console.log("Center successfully deleted!");

      setCentersData((prevData) =>
        prevData.filter((center) => center.id !== centerId)
      );
    } catch (error) {
      console.error("Error deleting center:", error.message);
    }
  };

  const editCenterHandler = (centerId) => {
    navigation.navigate("EditCenter", { centerId });
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={showAlertDelete}
        showProgress={false}
        title="Confirm Deletion"
        message="Are you sure you want to delete this center?"
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
          setShowAlertDelete(false);
          if (selectedDonationId) {
            deleteCenterHandler(selectedDonationId);
          }
        }}
        onCancelPressed={() => {
          setShowAlertDelete(false);
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
          {centersData.length ? (
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
                    <View style={styles.centerButtons}>
                      <TouchableOpacity
                        style={styles.deleteCenterButton}
                        onPress={() => {
                          setSelectedDonationId(item.id);
                          setShowAlertDelete(true);
                        }}
                      >
                        <FontAwesomeIcon
                          style={styles.centerButtonIcon}
                          icon={faTrash}
                          size={15}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editCenterButton}
                        onPress={() => editCenterHandler(item.id)}
                      >
                        <FontAwesomeIcon
                          style={styles.centerButtonIcon}
                          icon={faPenToSquare}
                          size={15}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          ) : (
            <View style={styles.noContentMessage}>
              <FontAwesomeIcon
                style={styles.centerIcon}
                icon={faFaceFrown}
                size={25}
              />
              <Text style={styles.noContentText}>You don't have centers!</Text>
            </View>
          )}
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
    height: 115,
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
    height: 110,
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
  centerButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 80,
    height: 20,
    marginVertical: 5,
  },
  deleteCenterButton: {
    backgroundColor: "#D2042D",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  editCenterButton: {
    backgroundColor: "#1f1f1f",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  centerButtonIcon: {
    color: "#ffffff",
  },
  noContentMessage: {
    height: 320,
    width: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  noContentText: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 18,
  },
});
