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
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons/faFaceFrown";
import AwesomeAlert from "react-native-awesome-alerts";

import Spinner from "react-native-loading-spinner-overlay";
import DropDownPicker from "react-native-dropdown-picker";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "react-native";

import { useAdminUpdateContext } from "../AdminContext";
import NavBar from "../Navbar";

export default function Campaigns() {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [campaignsData, setCampaignsData] = useState([]);
  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  const [showAlertDelete, setShowAlertDelete] = useState(false);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getCampaigns();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("campaignsIsPressed");
      getCampaigns();
    }, [])
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
      setLoading(false);
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
    try {
      await deleteDoc(doc(db, "campaigns", campaignId));

      console.log("Campaign successfully deleted!");

      setCampaignsData((prevData) =>
        prevData.filter((campaign) => campaign.id !== campaignId)
      );
    } catch (error) {
      console.error("Error deleting center:", error.message);
    }
  };

  const editCampaignHandler = (campaignId) => {
    navigation.navigate("EditCampaign", { campaignId });
  };

  const getStatus = (startDate, expireDate) => {
    const currentDate = new Date();
    const startDateObj = parseDate(startDate);
    const expireDateObj = parseDate(expireDate);

    if (currentDate < startDateObj) {
      return {
        status: "UPCOMING",
        backgroundColor: "#ffd7b5",
        color: "#FFA500",
        borderColor: "#FFA500",
      };
    } else if (currentDate >= startDateObj && currentDate <= expireDateObj) {
      return {
        status: "ON-GOING",
        backgroundColor: "#cdffcd",
        color: "#0BDA51",
        borderColor: "#0BDA51",
      };
    } else {
      return {
        status: "EXPIRED",
        backgroundColor: "#FFCCCB",
        color: "#ff0000",
        borderColor: "#ff0000",
      };
    }
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split(".");
    return new Date(year, month - 1, day);
  };

  const filteredCampaigns = campaignsData.filter((campaign) => {
    if (selectedStatus === "all") {
      return true;
    } else {
      return (
        getStatus(campaign.startDate, campaign.expireDate).status ===
        selectedStatus.toUpperCase()
      );
    }
  });

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        color="#ddb31b"
        overlayColor="rgba(0,0,0,0.5)"
      />
      <AwesomeAlert
        show={showAlertDelete}
        showProgress={false}
        title="Confirm Deletion"
        message="Are you sure you want to delete this campaign?"
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
          setShowAlertDelete(false);
          if (selectedCampaignId) {
            deleteCampaignHandler(selectedCampaignId);
          }
        }}
        onCancelPressed={() => {
          setShowAlertDelete(false);
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
      <View style={styles.campaignsContent}>
        <View style={styles.header}>
          <View style={styles.titleHeader}>
            <Text style={styles.pageTitle}>Campaigns</Text>
            <TouchableOpacity onPress={() => addCampaignHandler()}>
              <FontAwesomeIcon
                style={styles.addCampaignIcon}
                icon={faPlus}
                size={25}
              />
            </TouchableOpacity>
          </View>
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
                backgroundColor: "#D3D3D3",
                width: 130,
              }}
            />
          </View>
        </View>

        <View style={styles.campaigns}>
          {filteredCampaigns.length && !loading ? (
            <FlatList
              keyExtractor={(campaign) => campaign.id}
              data={filteredCampaigns}
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
                    <View>
                      <Text style={styles.campaignField}>
                        <Text style={{ fontWeight: "bold" }}>Name {"\n"}</Text>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.campaignStatusField,
                          {
                            color: getStatus(item.startDate, item.expireDate)
                              .color,
                            backgroundColor: getStatus(
                              item.startDate,
                              item.expireDate
                            ).backgroundColor,
                            borderColor: getStatus(
                              item.startDate,
                              item.expireDate
                            ).borderColor,
                          },
                        ]}
                      >
                        {getStatus(item.startDate, item.expireDate).status}
                      </Text>
                    </View>

                    <View style={styles.campaignsButtons}>
                      <TouchableOpacity
                        style={styles.deleteCampaignButton}
                        onPress={() => {
                          setSelectedCampaignId(item.id);
                          setShowAlertDelete(true);
                        }}
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
          ) : (
            !loading && (
              <View style={styles.noContentMessage}>
                <FontAwesomeIcon
                  style={styles.campaignIcon}
                  icon={faFaceFrown}
                  size={25}
                />
                <Text style={styles.noContentText}>
                  You don't have campaigns!
                </Text>
              </View>
            )
          )}
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
    marginRight: 10,
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1,
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
  noContentMessage: {
    height: 320,
    width: 350,
    alignItems: "center",
    justifyContent: "center",
  },
  noContentText: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 18,
  },
  campaignStatusField: {
    fontSize: 14,
    fontWeight: 800,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    paddingVertical: 2,
    width: 110,
  },
  dropdown: {
    backgroundColor: "#D3D3D3",
    width: 130,
    zIndex: 100,
  },
  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
});
