import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { collection } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAudioDescription } from "@fortawesome/free-solid-svg-icons/faAudioDescription";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons/faCalendarDays";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import AwesomeAlert from "react-native-awesome-alerts";

import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CampaignForm() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [showAlertAdd, setShowAlertAdd] = useState(false);
  const [showAlertRequired, setShowAlertRequired] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    expireDate: null,
    link: "",
  });

  const addCampaignHandler = async () => {
    try {
      const newCampaignRef = doc(collection(db, "campaigns"));
      await setDoc(newCampaignRef, campaignData);
      navigation.navigate("AdminCampaigns");

      console.log("Campaign added successfully!");
    } catch (error) {
      console.error("Error added campaign:", error);
    }
  };

  const formatExpireDate = async (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const dateChangeHandler = async (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      const formattedExpireDate = await formatExpireDate(date);
      setCampaignData({ ...campaignData, expireDate: formattedExpireDate });
    }
  };

  return (
    <View style={styles.container}>
      <AwesomeAlert
        show={showAlertAdd}
        showProgress={false}
        title="Confirm Addition"
        message="Are you sure you want to add this campaign?"
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
          setShowAlertAdd(false);
          addCampaignHandler();
        }}
        onCancelPressed={() => {
          setShowAlertAdd(false);
        }}
      />
      <AwesomeAlert
        show={showAlertRequired}
        showProgress={false}
        title="All fields are required"
        message="Please fill in all the fields."
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="Ok"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{ backgroundColor: "#1f1f1f" }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: "#eaebed" }}
        onConfirmPressed={() => {
          setShowAlertRequired(false);
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
              icon={faLink}
              size={20}
            />

            <TextInput
              value={campaignData.link}
              style={styles.input}
              placeholder={"Link"}
              placeholderTextColor={"#a6a6a6"}
              autoCapitalize="none"
              onChangeText={(link) =>
                setCampaignData({ ...campaignData, link: link })
              }
            ></TextInput>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesomeIcon
              style={styles.campaignIcon}
              icon={faCalendarDays}
              size={20}
            />

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              style={styles.datePickerContainer}
            >
              <Text style={styles.datePickerInput}>
                {selectedDate.toDateString()}
              </Text>
              {showPicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={dateChangeHandler}
                  minimumDate={new Date()}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addCampaignButtonContainer}>
          <TouchableOpacity
            style={styles.addCampaignButton}
            onPress={() => {
              if (
                !campaignData.name ||
                !campaignData.description ||
                campaignData.expireDate === null ||
                !campaignData.link
              ) {
                setShowAlertRequired(true);
              } else {
                setShowAlertAdd(true);
              }
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Add Campaign</Text>
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
  datePickerContainer: {
    justifyContent: "space-between",
  },
  datePickerInput: {
    marginTop: 15,
    color: "#ffffff",
  },
});
