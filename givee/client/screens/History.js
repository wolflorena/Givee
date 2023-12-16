import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import NavBar from "../Navbar";
import GoBackButton from "../GoBackButton";
import Title from "../Title";
import { useLoginContext, useLoginUpdateContext } from "../LoginContext";
import React, { useState, useCallback, useEffect } from "react";
import { StatusBar } from "react-native";
import { FIREBASE_DB } from "../../firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

export default function Centers() {
  const [donationsData, setDonationsData] = useState([]);
  const { currentUser } = useLoginContext();
  const { navBarButtonsPressHandler } = useLoginUpdateContext();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getDonations();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("myProfileIsPressed");
    }, [])
  );

  const getDonations = useCallback(async () => {
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "donations"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        const { timestamp, ...donation } = doc.data();
        if (doc.data().userEmail === currentUser.email) {
          const formattedTimestamp = timestamp.toDate().toString();
          data.push({ id: doc.id, ...donation, timestamp: formattedTimestamp });
        }
      });

      setDonationsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });
  return (
    <View style={styles.container}>
      <GoBackButton />
      <Title text="My Donations" />
      <View style={styles.donationsContainer}>
        {donationsData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require("../../assets/noDonations.png")} // Update with your image path
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No donations made yet. 🙁</Text>
          </View>
        ) : (
          <View style={styles.donations}>
            <FlatList
              data={donationsData}
              keyExtractor={(donation) => donation.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.donationCard}>
                  <View style={styles.donationData}>
                    <Text style={styles.donationField}>
                      <Text style={{ fontWeight: "bold" }}>Donation: </Text>
                      {item.type}
                    </Text>
                    <Text style={styles.donationField}>
                      <Text style={{ fontWeight: "bold" }}>Time: </Text>
                      {item.timestamp}
                    </Text>
                    <Text style={styles.donationField}>
                      <Text style={{ fontWeight: "bold" }}>Status: </Text>
                      {item.status}
                    </Text>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    flex: 1,
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
    backgroundColor: "#eaebed",
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
  },
  donationData: {
    height: 100,
    width: 250,
    justifyContent: "space-evenly",
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
  },
});
