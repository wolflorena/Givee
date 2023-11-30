import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import { StatusBar } from "react-native";
import GoBackButton from "../GoBackButton";
import CustomButton from "../CustomButton";
import Title from "../Title";
import { useLoginContext } from "../LoginContext";
import { doc, setDoc } from "firebase/firestore";

export default function Location({ route }) {
  let formData = route.params;
  const [centersData, setCentersData] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const { currentUser } = useLoginContext();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCenters();
  }, []);

  const getCenters = useCallback(async () => {
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "centers"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        if (doc.data().type.includes(formData.type))
          data.push({ id: doc.id, ...doc.data() });
      });

      setCentersData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const submitDonation = async () => {
    try {
      const donationData = {
        ...formData,
        centerId: selectedCenter,
        userEmail: currentUser.email,
        status: "pending",
        timestamp: serverTimestamp(),
      };

      const newDonationRef = doc(collection(FIREBASE_DB, "donations"));
      await setDoc(newDonationRef, donationData);

      console.log("Donation submitted successfully!");
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  return (
    <View style={styles.container}>
      <GoBackButton />
      <Title text="Location" />
      <View style={styles.centersContent}>
        <View style={styles.centers}>
          <FlatList
            data={centersData}
            keyExtractor={(center) => center.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.centerCard,
                  item.id === selectedCenter ? styles.selected : null,
                ]}
                onPress={() => setSelectedCenter(item.id)}
              >
                <View style={styles.centerData}>
                  <Text style={styles.centerField}>
                    <Text style={{ fontWeight: "bold" }}>Address {"\n"}</Text>
                    {item.address}
                  </Text>
                  <Text style={styles.centerField}>
                    <Text style={{ fontWeight: "bold" }}>Latitude {"\n"}</Text>
                    {item.latitude}
                  </Text>
                  <Text style={styles.centerField}>
                    <Text style={{ fontWeight: "bold" }}>Longitute {"\n"}</Text>
                    {item.longitude}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          ></FlatList>
        </View>
      </View>
      <CustomButton text="Donate" size="large" onPress={submitDonation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    flex: 1,
  },
  centersContent: {
    justifyContent: "space-between",
    height: 600,
    width: 380,
    padding: 15,
  },
  centers: {
    marginVertical: 10,
    height: 600,
    width: 350,
  },
  centerCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 120,
    width: 350,
    padding: 5,
  },

  centerField: {
    fontSize: 15,
  },
  centerData: {
    height: 100,
    width: 250,
    justifyContent: "space-evenly",
  },
  selected: {
    backgroundColor: "#ddb31b",
  },
});
