import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faShirt,
  faUtensils,
  faFootball,
  faClock,
  faCheck,
  faXmark,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { collection, query, getDocs, getDoc, doc } from "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";

import { FIREBASE_DB } from "../../firebaseConfig";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import { useLoginContext, useLoginUpdateContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";

export default function Centers() {
  const [donationsData, setDonationsData] = useState([]);
  const [centerData, setCenterData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const { currentUser } = useLoginContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const { theme } = useContext(ThemeContext);

  const styles = getStyles(theme);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getDonations(selectedStatus);
  }, [selectedStatus]);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("myProfileIsPressed");
      getDonations(selectedStatus);
    }, [selectedStatus])
  );

  const getDonations = useCallback(async (status) => {
    setLoading(true);
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "donations"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        const { timestamp, ...donation } = doc.data();
        if (doc.data().userEmail === currentUser.email) {
          const date = timestamp.toDate();
          const formattedTimestamp = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()} - ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          getCenter(doc.data().centerId);

          data.push({
            id: doc.id,
            ...donation,
            timestamp: formattedTimestamp,
            centerAddress: centerData.address,
          });
        }
      });

      const sortedData = data.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") {
          return -1;
        } else if (a.status !== "pending" && b.status === "pending") {
          return 1;
        } else {
          return 0;
        }
      });

      setDonationsData(sortedData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  });

  const getCenter = useCallback(async (centerId) => {
    try {
      const db = FIREBASE_DB;
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

  const statusIcon = (status) => (
    <View>
      {status === "completed" && (
        <FontAwesomeIcon style={styles.statusIcon} icon={faCheck} size={25} />
      )}

      {status === "pending" && (
        <FontAwesomeIcon style={styles.statusIcon} icon={faSpinner} size={25} />
      )}

      {status === "canceled" && (
        <FontAwesomeIcon style={styles.statusIcon} icon={faXmark} size={25} />
      )}
    </View>
  );

  const renderEmptyMessage = () => {
    switch (selectedStatus) {
      case "all":
        return "You don't have donations yet. 😔";
      case "pending":
        return "You don't have pending donations. 😊";
      case "completed":
        return "You don't have completed donations. 😔";
      case "canceled":
        return "You don't have canceled donations. 😊";
      default:
        return "";
    }
  };

  const filteredDonations = donationsData.filter((donation) => {
    if (selectedStatus === "all") {
      return true;
    } else {
      return donation.status === selectedStatus;
    }
  });

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <GoBackButton />
      <View style={styles.header}>
        <Text style={styles.title}>My donations</Text>
        <View>
          <DropDownPicker
            items={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
              { label: "Canceled", value: "canceled" },
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
        {filteredDonations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/noDonations.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>{renderEmptyMessage()}</Text>
          </View>
        ) : (
          <View style={styles.donations}>
            <FlatList
              data={filteredDonations}
              keyExtractor={(donation) => donation.id}
              renderItem={({ item }) => (
                <View style={styles.donationCard}>
                  {donationIcon(item.type)}
                  <View style={styles.donationData}>
                    <View style={styles.donationField}>
                      <FontAwesomeIcon icon={faClock} size={16} />
                      <Text style={styles.donationField}>{item.timestamp}</Text>
                    </View>
                    <Text style={styles.donationField}>
                      <Text style={{ fontWeight: "bold" }}>Address: </Text>
                      {item.centerAddress}
                    </Text>
                    <Text style={styles.donationField}>
                      <Text style={{ fontWeight: "bold" }}>Details: </Text>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    {statusIcon(item.status)}
                    <Text style={{ fontSize: 12 }}>
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Text>
                  </View>
                </View>
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
    donationsContent: {
      justifyContent: "space-between",
      height: 600,
      width: 380,
      padding: 15,
    },
    donations: {
      marginVertical: 10,
      height: 600,
      width: 350,
    },
    donationCard: {
      backgroundColor: theme === "dark" ? "#eaebed" : "#a6a6a6",
      marginVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      height: 120,
      width: 350,
      padding: 5,
    },

    donationField: {
      fontSize: 15,
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    donationData: {
      height: 100,
      width: 220,
      justifyContent: "space-evenly",
      alignItems: "flex-start",
    },
    emptyContainer: {
      width: 350,
      height: 600,
      justifyContent: "center",
      alignItems: "center",
      gap: 50,
    },
    emptyImage: {
      height: 250,
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
    donationIcon: {
      color: "#1f1f1f",
      marginHorizontal: 12,
    },
    timeIcon: {
      width: 1,
    },
  });
