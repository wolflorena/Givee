import { View, Text, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import React, { useEffect, useState, useCallback } from "react";
import { useLoginContext, useLoginUpdateContext } from "../LoginContext";
import { FIREBASE_DB } from "../../firebaseConfig";
import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import GoBackButton from "../GoBackButton";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useLoginContext();
  const db = FIREBASE_DB;

  useEffect(() => {
    const initialMessage = {
      _id: 1,
      text: "Hello!",
      createdAt: new Date().toISOString(),
      user: {
        _id: "andreeacgabor@gmail.com",
        name: "Andreea Gabor",
      },
      recipient: currentUser.email,
    };

    const checkAndAddInitialMessage = async () => {
      const messagesQuery = query(
        collection(db, "chats"),
        where("user._id", "==", "andreeacgabor@gmail.com"),
        where("recipient", "==", currentUser.email)
      );
      const querySnapshot = await getDocs(messagesQuery);
      if (querySnapshot.empty) {
        const newChat = doc(collection(db, "chats"));
        await setDoc(newChat, initialMessage);
      }
    };

    const fetchMessages = async () => {
      try {
        const sentMessagesQuery = query(
          collection(db, "chats"),
          where("user._id", "==", currentUser.email)
        );

        const receivedMessagesQuery = query(
          collection(db, "chats"),
          where("recipient", "==", currentUser.email)
        );

        const sentMessagesSnapshot = await getDocs(sentMessagesQuery);
        const sentMessages = sentMessagesSnapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          user: doc.data().user,
        }));

        const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);
        const receivedMessages = receivedMessagesSnapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          user: doc.data().user,
        }));

        const combinedMessages = [...sentMessages, ...receivedMessages].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setMessages(combinedMessages);
      } catch (error) {
        console.error("Eroare la recuperarea mesajelor: ", error);
      }
    };

    checkAndAddInitialMessage();
    fetchMessages();
  }, [db, currentUser.email]);

  const onSend = useCallback(
    async (messages = []) => {
      try {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );

        const { _id, createdAt, text, user } = messages[0];

        const recipient = "andreeacgabor@gmail.com";

        const messageForFirebase = {
          _id,
          createdAt: createdAt.toISOString(),
          text,
          user,
          recipient,
        };
        const newChat = doc(collection(db, "chats"));

        await setDoc(newChat, messageForFirebase);
      } catch (error) {
        console.error("Eroare la trimiterea mesajului: ", error);
      }
    },
    [db]
  );

  return (
    <View style={styles.container}>
      <GoBackButton />
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser.email,
          name: currentUser.fullName,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    flex: 1,
  },
});
