import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Switch,
  FlatList,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import CustomButton from "../CustomButton";
import Navbar from "../Navbar";
import { ThemeContext } from "../ThemeContext";
import { useLoginUpdateContext } from "../LoginContext";
import { useFocusEffect } from "@react-navigation/native";
import GoBackButton from "../GoBackButton";

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [editingFullName, setEditingFullName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { navBarButtonsPressHandler } = useLoginUpdateContext();
  const styles = getStyles(theme);
  const isDarkMode = theme === "dark";

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
      setEditingFullName(user.displayName || "");
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      navBarButtonsPressHandler("myProfileIsPressed");
    }, [])
  );

  const handleUpdate = async () => {
    try {
      if (user) {
        await updateProfile(user, {
          displayName: editingFullName,
        });

        const userDoc = doc(FIREBASE_DB, "users", user.uid);
        await updateDoc(userDoc, {
          fullName: editingFullName,
        });

        setFullName(editingFullName);
        setSelectedId(null);

        Alert.alert("Succes", "Numele a fost actualizat");
      }
    } catch (error) {
      Alert.alert("Eroare", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          if (selectedId === item.id) {
            setSelectedId(null);
          } else {
            setSelectedId(item.id);
            setEditingFullName(fullName);
          }
        }}
      >
        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>{fullName}</Text>
      </TouchableOpacity>
      {selectedId && selectedId === item.id && (
        <View style={styles.itemModify}>
          <TextInput
            style={styles.input}
            placeholder={`New ${item.title}`}
            value={editingFullName}
            onChangeText={setEditingFullName}
          />
          <CustomButton text="Modify" size="little" onPress={handleUpdate} />
        </View>
      )}
      <View style={styles.item}>
        <Text style={styles.text}>
          {isDarkMode ? "Dark Mode" : "Light Mode"}
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </View>
  );

  const settingsOptions = [{ id: "1", title: "Full Name", key: "fullName" }];

  return (
    <View style={styles.container}>
      <GoBackButton />
      <FlatList
        style={styles.settingsList}
        data={settingsOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />

      <Navbar />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
    },
    settingsList: {
      marginTop: 10,
      height: 50,
    },
    item: {
      backgroundColor: theme === "dark" ? "#eaebed" : "#1f1f1f",
      marginVertical: 10,
      flexDirection: "row",
      borderRadius: 10,
      height: 50,
      width: 350,
      padding: 10,
      justifyContent: "space-between",
      alignItems: "center",
    },
    text: {
      color: theme === "dark" ? "#1f1f1f" : "#eaebed",
    },
    itemModify: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
    },
    input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 15,
      padding: 10,
      borderColor: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
      color: theme === "dark" ? "#a6a6a6" : "#1f1f1f",
      width: 200,
    },
  });
