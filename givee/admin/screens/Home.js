import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { collection, query, getDocs } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { faFootball } from "@fortawesome/free-solid-svg-icons/faFootball";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons/faFaceFrown";
import AwesomeAlert from "react-native-awesome-alerts";

import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

import NavBar from "../Navbar";
import { useAdminUpdateContext } from "../AdminContext";
import { useLoginContext } from "../../client/LoginContext";
import { useLoginUpdateContext } from "../../client/LoginContext";

export default function Home() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [donationsData, setDonationsData] = useState([]);
  const { currentUser } = useLoginContext();
  const { userLoggedOut } = useLoginUpdateContext();

  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showAlertComplete, setShowAlertComplete] = useState(false);

  const [selectedDonationId, setSelectedDonationId] = useState(null);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getDonations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("homeIsPressed");
      getDonations();
    }, [])
  );

  const getDonations = useCallback(async () => {
    setLoading(true);

    try {
      const q = query(collection(db, "donations"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setDonationsData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  });

  const donationIcon = (type) => (
    <View>
      {type === "toys" && (
        <FontAwesomeIcon
          style={styles.donationIcon}
          icon={faFootball}
          size={25}
        />
      )}

      {type === "clothes" && (
        <FontAwesomeIcon style={styles.donationIcon} icon={faShirt} size={25} />
      )}

      {type === "food" && (
        <FontAwesomeIcon
          style={styles.donationIcon}
          icon={faUtensils}
          size={25}
        />
      )}
    </View>
  );

  const completeDonationHandler = async (donationId) => {
    const donationRef = doc(db, "donations", donationId);

    try {
      await updateDoc(donationRef, {
        status: "completed",
      });

      console.log("Donation successfully completed!");

      setDonationsData((prevData) =>
        prevData.map((donation) =>
          donation.id === donationId
            ? { ...donation, status: "completed" }
            : donation
        )
      );
    } catch (error) {
      console.error("Error completing donation:", error.message);
    }
  };

  const cancelDonationHandler = async (donationId) => {
    const donationRef = doc(db, "donations", donationId);

    try {
      await updateDoc(donationRef, {
        status: "canceled",
      });

      console.log("Donation successfully canceled!");

      setDonationsData((prevData) =>
        prevData.map((donation) =>
          donation.id === donationId
            ? { ...donation, status: "canceled" }
            : donation
        )
      );
    } catch (error) {
      console.error("Error canceling donation:", error.message);
    }
  };

  const viewDonationDataHandler = (donationId) => {
    navigation.navigate("DonationData", {
      donationId,
      componentName: "Home",
    });
  };

  const handleLogout = () => {
    userLoggedOut();
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <AwesomeAlert
        show={showAlertCancel}
        showProgress={false}
        title="Confirm Cancel"
        message="Are you sure you want to cancel this donation?"
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
          setShowAlertCancel(false);
          if (selectedDonationId) {
            cancelDonationHandler(selectedDonationId);
          }
        }}
        onCancelPressed={() => {
          setShowAlertCancel(false);
        }}
      />

      <AwesomeAlert
        show={showAlertComplete}
        showProgress={false}
        title="Confirm Completion"
        message="Are you sure you want to mark this donation as complete?"
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
          setShowAlertComplete(false);
          if (selectedDonationId) {
            completeDonationHandler(selectedDonationId);
          }
        }}
        onCancelPressed={() => {
          setShowAlertComplete(false);
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

      <View style={styles.homeContent}>
        <View style={styles.header}>
          <Text style={styles.welcomeMessage}>
            Welcome{"\n"}
            <Text style={styles.welcomeName}>{currentUser.fullName}!</Text>
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              handleLogout();
            }}
          >
            <Text style={styles.logoutTextButton}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.donations}>
          {donationsData.some((donation) => donation.status === "pending") &&
          !loading ? (
            <FlatList
              keyExtractor={(donation) => donation.id}
              data={donationsData}
              renderItem={({ item }) => {
                return (
                  item.status === "pending" && (
                    <TouchableOpacity
                      style={styles.donationCard}
                      onPress={() => viewDonationDataHandler(item.id)}
                    >
                      {donationIcon(item.type)}
                      <View style={styles.donationData}>
                        <Text style={styles.donationField}>
                          <Text style={{ fontWeight: "bold" }}>
                            User email {"\n"}
                          </Text>
                          {item.userEmail}
                        </Text>
                        <View>
                          <View style={styles.donationButtons}>
                            <TouchableOpacity
                              style={styles.completedButton}
                              onPress={() => {
                                setSelectedDonationId(item.id);
                                setShowAlertComplete(true);
                              }}
                            >
                              <FontAwesomeIcon
                                style={styles.cardButtonIcon}
                                icon={faCheck}
                                size={20}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.canceledButton}
                              onPress={() => {
                                setSelectedDonationId(item.id);
                                setShowAlertCancel(true);
                              }}
                            >
                              <FontAwesomeIcon
                                style={styles.cardButtonIcon}
                                icon={faBan}
                                size={20}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                );
              }}
            ></FlatList>
          ) : (
            !loading && (
              <View style={styles.noContentMessage}>
                <FontAwesomeIcon
                  style={styles.donationIcon}
                  icon={faFaceFrown}
                  size={25}
                />
                <Text style={styles.noContentText}>
                  You don't have new donations!
                </Text>
              </View>
            )
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
  homeContent: {
    justifyContent: "space-between",
    height: 680,
    width: 380,
    padding: 15,
  },
  welcomeMessage: {
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
  donations: {
    marginVertical: 10,
    height: 590,
    width: 350,
  },
  donationCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 100,
    width: 350,
  },
  donationIcon: {
    color: "#ddb31b",
    marginHorizontal: 15,
  },
  donationField: {
    fontSize: 15,
  },
  donationData: {
    height: 100,
    width: 250,
    justifyContent: "space-evenly",
  },
  completedButton: {
    backgroundColor: "#50C878",
    width: 50,
    marginTop: 10,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  canceledButton: {
    backgroundColor: "#D2042D",
    width: 50,
    marginTop: 10,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  donationButtons: {
    flexDirection: "row",
  },
  cardButtonIcon: {
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
  logoutTextButton: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    backgroundColor: "#ddb31b",
    width: 90,
    height: 35,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
});
