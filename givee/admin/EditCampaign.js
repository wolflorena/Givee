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
import { faLink } from "@fortawesome/free-solid-svg-icons";
import AwesomeAlert from "react-native-awesome-alerts";

import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditCampaign({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    expireDate: null,
    link: "",
  });

  const campaignId = route.params ? route.params.campaignId : null;

  const [showAlertEdit, setShowAlertEdit] = useState(false);
  const [showAlertRequired, setShowAlertRequired] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCampaign();
  }, []);

  const getCampaign = useCallback(async () => {
    try {
      const docRef = doc(db, "campaigns", campaignId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const campaignDataFromFirebase = docSnap.data();
        setCampaignData(docSnap.data());

        const formattedExpireDate = campaignDataFromFirebase.expireDate
          ? new Date(
              campaignDataFromFirebase.expireDate.replace(
                /(\d{2})\.(\d{2})\.(\d{4})/,
                "$3-$2-$1"
              )
            )
          : new Date();

        setSelectedDate(formattedExpireDate);
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
        show={showAlertEdit}
        showProgress={false}
        title="Confirm Edit"
        message="Save changes to this campaign?"
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
          editCampaignHandler();
        }}
        onCancelPressed={() => {
          setShowAlertEdit(false);
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
              onChangeText={(link) => setCampaignData({ ...link, link: link })}
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
                setShowAlertEdit(true);
              }
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
  datePickerContainer: {
    justifyContent: "space-between",
  },
  datePickerInput: {
    marginTop: 15,
    color: "#ffffff",
  },
});
