import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

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

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function CenterData({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [donationData, setDonationData] = useState([]);
  const [centerData, setCenterData] = useState([]);

  const donationId = route.params ? route.params.donationId : null;

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

    navigation.navigate("AdminDonations");
  };

  const cancelDonationHandler = async () => {
    const donationRef = doc(db, "donations", donationId);

    await updateDoc(donationRef, {
      status: "canceled",
    });

    navigation.navigate("AdminDonations");
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
          <Text style={styles.donationText}>Completed</Text>
        </View>
      )}

      {status === "canceled" && (
        <View style={styles.donationData}>
          <FontAwesomeIcon style={styles.donationIcon} icon={faBan} size={20} />
          <Text style={styles.donationText}>Canceled</Text>
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

      <View style={styles.donationContent}>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faUser}
            size={20}
          />
          <Text style={styles.donationText}>{donationData.userEmail}</Text>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faMapPin}
            size={20}
          />
          <Text style={styles.donationText}>{centerData.address}</Text>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faListOl}
            size={20}
          />
          <Text style={styles.donationText}>{donationData.amount}</Text>
        </View>
        <View style={styles.donationData}>
          <FontAwesomeIcon
            style={styles.donationIcon}
            icon={faAudioDescription}
            size={20}
          />
          <Text style={styles.donationText}>{donationData.description}</Text>
        </View>
        <View>
          {donationData.status === "pending" ? (
            <View style={styles.donationButtons}>
              <TouchableOpacity
                style={styles.completedButton}
                onPress={() => completeDonationHandler()}
              >
                <Text style={styles.completeTextButton}>Complete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.canceledButton}
                onPress={() => cancelDonationHandler()}
              >
                <Text style={styles.cancelTextButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>{statusType(donationData.status)}</View>
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
    flexDirection: "row",
    marginVertical: 10,
    marginRight: 20,
  },
  completedButton: {
    backgroundColor: "#50C878",
    width: 120,
    marginTop: 20,
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
    marginTop: 20,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  donationButtons: {
    flexDirection: "row",
  },
});
