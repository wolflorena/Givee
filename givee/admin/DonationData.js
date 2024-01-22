import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faAudioDescription } from "@fortawesome/free-solid-svg-icons/faAudioDescription";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faListOl } from "@fortawesome/free-solid-svg-icons/faListOl";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import AwesomeAlert from "react-native-awesome-alerts";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function DonationData({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [donationData, setDonationData] = useState([]);
  const [centerData, setCenterData] = useState([]);

  const donationId = route.params ? route.params.donationId : null;
  const parentComponentName = route.params ? route.params.componentName : null;

  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showAlertComplete, setShowAlertComplete] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getDonation();
  }, []);

  const getDonation = useCallback(async () => {
    try {
      const docRef = doc(db, "donations", donationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDonationData(docSnap.data());
        getCenter(docSnap.data().centerId);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const getCenter = useCallback(async (centerId) => {
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

  const completeDonationHandler = async () => {
    const donationRef = doc(db, "donations", donationId);

    await updateDoc(donationRef, {
      status: "completed",
    });

    if (parentComponentName === "Donations") {
      navigation.navigate("AdminDonations");
    } else if (parentComponentName === "Home") {
      navigation.navigate("AdminHome");
    }
  };

  const cancelDonationHandler = async () => {
    const donationRef = doc(db, "donations", donationId);

    await updateDoc(donationRef, {
      status: "canceled",
    });

    if (parentComponentName === "Donations") {
      navigation.navigate("AdminDonations");
    } else if (parentComponentName === "Home") {
      navigation.navigate("AdminHome");
    }
  };

  const statusType = (status) => (
    <View>
      {status === "completed" && (
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faCheck}
            size={20}
          />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Status</Text>
            <Text style={styles.donationText}>Completed</Text>
          </View>
        </View>
      )}

      {status === "canceled" && (
        <View style={styles.donationData}>
          <FontAwesomeIcon style={styles.donationIcon} icon={faBan} size={20} />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Status</Text>
            <Text style={styles.donationText}>Canceled</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
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
          if (donationId) {
            cancelDonationHandler(donationId);
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
          if (donationId) {
            completeDonationHandler(donationId);
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

      <View style={styles.donationImageContainer}>
        {donationData.status === "pending" ? (
          <Image
            source={require("../assets/pendingDonation.png")}
            style={styles.pendingDonationImage}
          />
        ) : donationData.status === "completed" ? (
          <Image
            source={require("../assets/completedDonation.png")}
            style={styles.completedDonationImage}
          />
        ) : (
          donationData.status === "canceled" && (
            <Image
              source={require("../assets/canceledDonation.png")}
              style={styles.canceledDonationImage}
            />
          )
        )}
      </View>

      <View style={styles.donationContent}>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faUser}
            size={20}
          />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Client Email</Text>
            <Text style={styles.donationText}>{donationData.userEmail}</Text>
          </View>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faMapPin}
            size={20}
          />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Donation Center</Text>
            <Text style={styles.donationText}>{centerData.address}</Text>
          </View>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faListOl}
            size={20}
          />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Amount</Text>
            <Text style={styles.donationText}>{donationData.amount}</Text>
          </View>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faAudioDescription}
            size={20}
          />
          <View style={styles.donationInfo}>
            <Text style={styles.donationTextLabel}>Description</Text>
            <Text style={styles.donationText}>{donationData.description}</Text>
          </View>
        </View>

        {donationData.status === "pending" ? (
          <View style={styles.donationButtons}>
            <TouchableOpacity
              style={styles.completedButton}
              onPress={() => {
                setShowAlertComplete(true);
              }}
            >
              <Text style={styles.completeTextButton}>Complete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.canceledButton}
              onPress={() => {
                setShowAlertCancel(true);
              }}
            >
              <Text style={styles.cancelTextButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>{statusType(donationData.status)}</View>
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
  donationContent: {
    height: 750,
    width: 350,
    paddingVertical: 20,
  },
  donationIcon: {
    color: "#ddb31b",
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
  donationText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 15,
  },
  donationData: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 10,
    marginRight: 20,
  },
  completedButton: {
    backgroundColor: "#50C878",
    width: 120,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  cancelTextButton: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  completeTextButton: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  canceledButton: {
    backgroundColor: "#D2042D",
    width: 120,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  donationButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 80,
  },
  donationImageContainer: {
    width: 500,
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  completedDonationImage: {
    width: 220,
    height: 170,
  },
  canceledDonationImage: {
    width: 178,
    height: 200,
  },
  pendingDonationImage: {
    width: 280,
    height: 125,
  },
  donationTextLabel: {
    color: "#ffffff",
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "bold",
  },
  donationInfo: {
    alignItems: "flex-start",
  },
});
