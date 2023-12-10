import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAudioDescription } from "@fortawesome/free-solid-svg-icons/faAudioDescription";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";

import { useNavigation } from "@react-navigation/native";

export default function EditCampaign({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    expireDate: null,
  });

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

  const editCampaignHandler = async () => {
    const campaignRef = doc(db, "campaigns", campaignId);
    await updateDoc(campaignRef, campaignData);
    navigation.navigate("AdminCampaigns");
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
      <View style={styles.campaignForm}>
        <View>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.campaignIcon}
              icon={faHeart}
              size={20}
            />
            <TextInput
              value={campaignData.name}
              style={styles.input}
              placeholder={"Campaign name"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(name) =>
                setCampaignData({ ...campaignData, name: name })
              }
            ></TextInput>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.campaignIcon}
              icon={faAudioDescription}
              size={20}
            />
            <TextInput
              value={campaignData.description}
              style={styles.input}
              placeholder={"Campaign description"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(description) =>
                setCampaignData({ ...campaignData, description: description })
              }
            ></TextInput>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.campaignIcon}
              icon={faCalendarDays}
              size={20}
            />

            <TextInput
              value={campaignData.expireDate}
              style={styles.input}
              placeholder={"Expire date: DD.MM.YY"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(expireDate) =>
                setCampaignData({ ...campaignData, expireDate: expireDate })
              }
            ></TextInput>
          </View>
        </View>

        <View style={styles.addCampaignButtonContainer}>
          <TouchableOpacity
            style={styles.addCampaignButton}
            onPress={() => {
              editCampaignHandler();
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Edit Campaign</Text>
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
  campaignForm: {
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
  addCampaignButton: {
    backgroundColor: "#ddb31b",
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    borderRadius: 10,
    fontSize: 15,
  },
  addCampaignButtonContainer: {
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
  inputContainer: {
    flexDirection: "row",
  },
  campaignIcon: {
    marginTop: 12,
    marginRight: 10,
    color: "#ddb31b",
  },
});
