import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faShirt } from "@fortawesome/free-solid-svg-icons/faShirt";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { faFootball } from "@fortawesome/free-solid-svg-icons/faFootball";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faBan } from "@fortawesome/free-solid-svg-icons/faBan";
import { StatusBar } from "react-native";
import NavBar from "../Navbar";
import { collection, query, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

export default function Donations() {
  const navigation = useNavigation();
  const [donationsData, setDonationsData] = useState([]);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getDonations();
  }, []);

  const getDonations = useCallback(async () => {
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "donations"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setDonationsData(data);
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

  const viewDonationDataHandler = (donationId) => {
    navigation.navigate("DonationData", { donationId });
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
      <View style={styles.donationsContent}>
        <Text style={styles.pageTitle}>Donations</Text>

        <View style={styles.donations}>
          <FlatList
            keyExtractor={(donation) => donation.id}
            data={donationsData}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.donationCard}
                onPress={() => viewDonationDataHandler(item.id)}
              >
                {donationIcon(item.type)}
                <View style={styles.centerData}>
                  <Text style={styles.centerField}>
                    <Text style={{ fontWeight: "bold" }}>
                      User email {"\n"}
                    </Text>
                    {item.userEmail}
                  </Text>
                  <View>
                    {item.status === "pending" && (
                      <View style={styles.donationButtons}>
                        <TouchableOpacity
                          style={styles.completedButton}
                          onPress={() => completeDonationHandler()}
                        >
                          <FontAwesomeIcon
                            style={styles.completeIcon}
                            icon={faCheck}
                            size={20}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.canceledButton}
                          onPress={() => cancelDonationHandler()}
                        >
                          <FontAwesomeIcon
                            style={styles.cancelIcon}
                            icon={faBan}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
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
  donationsContent: {
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
  donations: {
    marginVertical: 10,
    height: 620,
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
  completeIcon: {
    color: "#ffffff",
  },
  cancelIcon: {
    color: "#ffffff",
  },
});
