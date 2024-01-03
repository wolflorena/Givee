import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import CustomButton from "../CustomButton";
import Navbar from "../Navbar";

export default function Settings() {
  const [fullName, setFullName] = useState("");
  const [editingFullName, setEditingFullName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setFullName(user.displayName || "");
      setEditingFullName(user.displayName || "");
    }
  }, [user]);

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

        setFullName(editingFullName); // Actualizați starea fullName pentru a reflecta modificarea
        setSelectedId(null); // Opțional, pentru a ascunde inputul

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
          setSelectedId(item.id);
          setEditingFullName(fullName);
        }}
      >
        <Text>{item.title}</Text>
        <Text>{fullName}</Text>
      </TouchableOpacity>
      {selectedId === item.id && (
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
    </View>
  );

  const settingsOptions = [{ id: "1", title: "Full Name", key: "fullName" }];

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  settingsList: {
    marginTop: 100,
  },
  item: {
    backgroundColor: "#eaebed",
    marginVertical: 10,
    flexDirection: "row",
    borderRadius: 10,
    height: 50,
    width: 350,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
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
    borderColor: "#a6a6a6",
    color: "#a6a6a6",
    width: 200,
  },
});
