import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faAudioDescription } from "@fortawesome/free-solid-svg-icons/faAudioDescription";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

export default function CampaignData({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [campaignData, setCampaignData] = useState([]);

  const campaignId = route.params ? route.params.campaignId : null;

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCampaign();
  }, []);

  const getCampaign = useCallback(async () => {
    try {
      const docRef = doc(db, "campaigns", campaignId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCampaignData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

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

      <View style={styles.campaignContent}>
        <View style={styles.campaignData}>
          <FontAwesomeIcon
            style={styles.campaignIcon}
            icon={faHeart}
            size={20}
          />
          <Text style={styles.campaignText}>{campaignData.name}</Text>
        </View>
        <View style={styles.campaignData}>
          <FontAwesomeIcon
            style={styles.campaignIcon}
            icon={faAudioDescription}
            size={20}
          />
          <Text style={styles.campaignText}>{campaignData.description}</Text>
        </View>
        <View style={styles.campaignData}>
          <FontAwesomeIcon
            style={styles.campaignIcon}
            icon={faCalendarDays}
            size={20}
          />
          <Text style={styles.campaignText}>{campaignData.expireDate}</Text>
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
  campaignContent: {
    height: 750,
    width: 350,
    paddingVertical: 20,
  },
  campaignIcon: {
    color: "#ddb31b",
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
  },
  goBackIcon: {
    color: "#eaebed",
  },
  campaignText: {
    color: "#ffffff",
    marginLeft: 10,
    fontSize: 15,
  },
  campaignData: {
    flexDirection: "row",
    marginVertical: 10,
    marginRight: 20,
  },
});
