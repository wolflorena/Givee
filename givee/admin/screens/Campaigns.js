import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faGift } from "@fortawesome/free-solid-svg-icons/faGift";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";

import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

import { useAdminUpdateContext } from "../AdminContext";
import NavBar from "../Navbar";

export default function Campaigns() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [campaignsData, setCampaignsData] = useState([]);
  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCampaigns();
  });

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("campaignsIsPressed");
    }, [])
  );

  const getCampaigns = useCallback(async () => {
    try {
      const q = query(collection(db, "campaigns"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setCampaignsData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  const viewCampaignDataHandler = (campaignId) => {
    navigation.navigate("CampaignData", { campaignId });
  };

  const addCampaignHandler = () => {
    navigation.navigate("CampaignForm");
  };

  const deleteCampaignHandler = async (campaignId) => {
    await deleteDoc(doc(db, "campaigns", campaignId));
  };

  const editCampaignHandler = (campaignId) => {
    navigation.navigate("EditCampaign", { campaignId });
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
      <View style={styles.campaignsContent}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Campaigns</Text>
          <TouchableOpacity onPress={() => addCampaignHandler()}>
            <FontAwesomeIcon
              style={styles.addCampaignIcon}
              icon={faPlus}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.campaigns}>
          <FlatList
            keyExtractor={(campaign) => campaign.id}
            data={campaignsData}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.campaignCard}
                onPress={() => viewCampaignDataHandler(item.id)}
              >
                <FontAwesomeIcon
                  style={styles.campaignIcon}
                  icon={faGift}
                  size={30}
                />
                <View style={styles.campaignData}>
                  <View style={styles.campaignContent}>
                    <Text style={styles.campaignField}>
                      <Text style={{ fontWeight: "bold" }}>Name {"\n"}</Text>
                      {item.name}
                    </Text>
                    <Text style={styles.campaignField}>
                      <Text style={{ fontWeight: "bold" }}>
                        Expire Date {"\n"}
                      </Text>
                      {item.expireDate}
                    </Text>
                  </View>

                  <View style={styles.campaignsButtons}>
                    <TouchableOpacity
                      style={styles.deleteCampaignButton}
                      onPress={() => deleteCampaignHandler(item.id)}
                    >
                      <FontAwesomeIcon
                        style={styles.campaignButtonIcon}
                        icon={faTrash}
                        size={15}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editCampaignButton}
                      onPress={() => editCampaignHandler(item.id)}
                    >
                      <FontAwesomeIcon
                        style={styles.campaignButtonIcon}
                        icon={faPenToSquare}
                        size={15}
                      />
                    </TouchableOpacity>
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
  campaignsContent: {
    justifyContent: "space-between",
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
  campaigns: {
    marginVertical: 10,
    height: 620,
    width: 350,
  },
  campaignCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 100,
    width: 350,
  },
  campaignIcon: {
    color: "#ddb31b",
    marginHorizontal: 15,
  },
  campaignField: {
    fontSize: 15,
  },
  campaignData: {
    height: 100,
    width: 280,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addCampaignIcon: {
    color: "#ddb31b",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  campaignsButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 80,
    height: 30,
  },
  deleteCampaignButton: {
    backgroundColor: "#D2042D",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  editCampaignButton: {
    backgroundColor: "#1f1f1f",
    height: 35,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  campaignButtonIcon: {
    color: "#ffffff",
  },
});
