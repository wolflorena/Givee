import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { collection, query, getDocs } from "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";
import AwesomeAlert from "react-native-awesome-alerts";
import { useFocusEffect } from "@react-navigation/native";

import { FIREBASE_DB } from "../../firebaseConfig";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import { ThemeContext } from "../ThemeContext";

export default function AllCampaigns() {
  const db = FIREBASE_DB;

  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  const [campaignsData, setCampaignsData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotSupportedLinkAlert, setshowNotSupportedLinkAlert] =
    useState(false);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCampaigns();
  }, [selectedStatus]);

  useFocusEffect(
    React.useCallback(() => {
      getCampaigns();
    }, [selectedStatus])
  );

  const getCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "campaigns"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setCampaignsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  });

  const filteredCampaigns = campaignsData.filter((campaign) =>
    selectedStatus === "all"
      ? true
      : getStatus(campaign.startDate, campaign.expireDate).status ===
        selectedStatus.toUpperCase()
  );

  const getStatus = (startDate, expireDate) => {
    const currentDate = new Date();
    const startDateObj = convertToDate(startDate);
    const expireDateObj = convertToDate(expireDate);

    if (currentDate < startDateObj) {
      return {
        status: "UPCOMING",
      };
    } else if (currentDate >= startDateObj && currentDate <= expireDateObj) {
      return {
        status: "ONGOING",
      };
    } else {
      return {
        status: "EXPIRED",
      };
    }
  };

  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split(".");
    return new Date(`${year}-${month}-${day}`);
  };

  const renderEmptyMessage = () => {
    switch (selectedStatus) {
      case "all":
        return "There are no campaigns. 😔";
      case "upcoming":
        return "There are no upcoming campaigns. 😔";
      case "ongoing":
        return "There are no on-going campaigns. 😔";
      case "expired":
        return "There are no expired campaigns. 😊";
      default:
        return "";
    }
  };

  const openLink = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url).catch(() => {
            setshowNotSupportedLinkAlert(true);
          });
        } else {
          setshowNotSupportedLinkAlert(true);
        }
      })
      .catch(() => {
        setshowNotSupportedLinkAlert(true);
      });
  };

  const calculateDaysLeft = (expireDateString) => {
    const expireDate = convertToDate(expireDateString);
    const currentDate = new Date();
    const differenceInTime = expireDate - currentDate;
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const parseDateForDisplay = (dateString) => {
    const [day, month] = dateString.split(".");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return { day, month: months[parseInt(month, 10) - 1] };
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <AwesomeAlert
        show={showNotSupportedLinkAlert}
        showProgress={false}
        title="We're sorry"
        message="The URL is unavailable at this moment. Please contact us!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="rgba(221, 179, 27,0.7)"
        alertContainerStyle={{ backgroundColor: "rgba(31,31,31,0.5)" }}
        contentContainerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
        }}
        titleStyle={{ color: "#ddb31b" }}
        messageStyle={{ color: theme === "dark" ? "#eaebed" : "#1f1f1f" }}
        onConfirmPressed={() => {
          setshowNotSupportedLinkAlert(false);
        }}
      />
      <GoBackButton />
      <View style={styles.header}>
        <Text style={styles.title}>Campaigns</Text>
        <View>
          <DropDownPicker
            items={[
              { label: "All", value: "all" },
              { label: "Upcoming", value: "upcoming" },
              { label: "On-going", value: "ongoing" },
              { label: "Expired", value: "expired" },
            ]}
            open={dropdownIsOpen}
            setOpen={() => setDropdownIsOpen(!dropdownIsOpen)}
            value={selectedStatus}
            setValue={(val) => setSelectedStatus(val)}
            style={styles.dropdown}
            textStyle={{ color: "black", fontSize: 15, fontWeight: "500" }}
            dropDownContainerStyle={{
              backgroundColor: theme === "dark" ? "#eaebed" : "#a6a6a6",
              width: 130,
              zIndex: 100,
            }}
          />
        </View>
      </View>
      <View>
        {filteredCampaigns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/noCampaign.png")}
              resizeMode="contain"
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>{renderEmptyMessage()}</Text>
          </View>
        ) : (
          <View style={styles.campaigns}>
            <FlatList
              data={filteredCampaigns}
              keyExtractor={(campaign) => campaign.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.campaignCard}
                  onPress={() => {
                    openLink(item.link);
                  }}
                >
                  <View style={styles.dateContainer}>
                    <Text style={styles.dayText}>
                      {parseDateForDisplay(item.startDate).day}
                    </Text>
                    <Text style={styles.monthText}>
                      {parseDateForDisplay(item.startDate).month}
                    </Text>
                  </View>
                  <View style={styles.campaignData}>
                    <Text style={styles.campaignTitle}>{item.name}</Text>
                    <Text
                      style={styles.campaignDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.description}
                    </Text>

                    {calculateDaysLeft(item.expireDate) > 0 ? (
                      <Text style={styles.endDate}>
                        Ends in {calculateDaysLeft(item.expireDate)} days
                      </Text>
                    ) : (
                      <Text style={[styles.endedCampaign, styles.endDate]}>
                        Ended {Math.abs(calculateDaysLeft(item.expireDate))}{" "}
                        days ago
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            ></FlatList>
          </View>
        )}
      </View>
      <NavBar />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      flex: 1,
    },
    title: {
      color: theme === "dark" ? "#eaebed" : "#1f1f1f",
      fontSize: 30,
    },
    dropdown: {
      backgroundColor: theme === "dark" ? "#eaebed" : "#a6a6a6",
      width: 130,
      zIndex: 100,
    },
    header: {
      paddingTop: 10,
      width: 350,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 1,
    },
    campaigns: {
      marginVertical: 10,
      height: 600,
      width: 350,
    },
    campaignCard: {
      backgroundColor: theme === "dark" ? "#eaebed" : "#a6a6a6",
      marginVertical: 10,
      flexDirection: "row",
      borderRadius: 10,
      gap: 5,
      height: 150,
      width: 350,
      padding: 10,
    },
    dateContainer: {
      width: 60,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#a6a6a6",
      borderRadius: 10,
      padding: 5,
    },
    dayText: {
      fontSize: 35,
      color: "#ddb31b",
      fontWeight: "800",
    },
    monthText: {
      fontSize: 20,
      color: "#ddb31b",
      fontWeight: "900",
    },
    campaignData: {
      flex: 1,
      gap: 10,
      marginLeft: 5,
    },
    campaignTitle: {
      fontSize: 20,
      fontWeight: "600",
    },
    campaignDescription: {
      flexShrink: 1,
    },
    endDate: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    endedCampaign: {
      color: "#BB342F",
    },
    emptyContainer: {
      width: 350,
      height: 600,
      justifyContent: "center",
      alignItems: "center",
      gap: 50,
    },
    emptyImage: {
      height: 200,
      width: 250,
    },
    emptyText: {
      color: "#DDB31B",
      fontSize: 25,
      textAlign: "center",
    },
    statusContainer: {
      width: 80,
      alignItems: "center",
      gap: 5,
    },
  });
