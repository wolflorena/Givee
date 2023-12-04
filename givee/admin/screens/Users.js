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
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { StatusBar } from "react-native";
import NavBar from "../Navbar";
import { collection, query, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { useAdminUpdateContext } from "../AdminContext";

export default function Users() {
  const navigation = useNavigation();
  const [usersData, setUsersData] = useState([]);
  const { navBarButtonsPressHandler } = useAdminUpdateContext();

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    getUsers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("usersIsPressed");
    }, [])
  );

  const getUsers = useCallback(async () => {
    try {
      const db = FIREBASE_DB;
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setUsersData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

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
      <View style={styles.usersContent}>
        <Text style={styles.pageTitle}>Users</Text>

        <View style={styles.users}>
          <FlatList
            keyExtractor={(user) => user.id}
            data={usersData}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <FontAwesomeIcon
                  style={styles.userIcon}
                  icon={faCircleUser}
                  size={30}
                />
                <View style={styles.userData}>
                  <Text style={styles.userField}>
                    <Text style={{ fontWeight: "bold" }}>Full Name {"\n"}</Text>
                    {item.fullName}
                  </Text>
                  <Text style={styles.userField}>
                    <Text style={{ fontWeight: "bold" }}>Email {"\n"}</Text>
                    {item.email}
                  </Text>
                </View>
              </View>
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
  usersContent: {
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
  users: {
    marginVertical: 10,
    height: 620,
    width: 350,
  },
  userCard: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    height: 100,
    width: 350,
  },
  userIcon: {
    color: "#ddb31b",
    marginHorizontal: 15,
  },
  userField: {
    fontSize: 15,
  },
  userData: {
    height: 100,
    width: 250,
    justifyContent: "space-evenly",
  },
});
