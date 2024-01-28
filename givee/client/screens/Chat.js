import React, { useEffect, useState, useCallback, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Time,
  Send,
} from "react-native-gifted-chat";
import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";

import { useLoginContext } from "../LoginContext";
import { ThemeContext } from "../ThemeContext";
import { FIREBASE_DB } from "../../firebaseConfig";
import GoBackButton from "../GoBackButton";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useLoginContext();
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const db = FIREBASE_DB;

  useEffect(() => {
    const initialMessage = {
      _id: 1,
      text: "Hello! What can we do for you?",
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

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
          borderTopColor: "#e2e2e2",
          borderTopWidth: 1,
          padding: 8,
        }}
        textInputStyle={{
          color: theme === "dark" ? "#eaebed" : "#1f1f1f",
          fontSize: 15,
        }}
      />
    );
  };

  const renderChatFooter = () => {
    return <View style={{ height: 20 }} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#ddb31b",
          },
          left: {
            backgroundColor: "#a6a6a6",
          },
        }}
        textStyle={{
          right: {
            color: "#1f1f1f",
          },
          left: {
            color: "#1f1f1f",
          },
        }}
      />
    );
  };

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: "#1f1f1f",
          },
          left: {
            color: "#1f1f1f",
          },
        }}
      />
    );
  };

  const renderSendButton = (props) => {
    return (
      <Send
        {...props}
        textStyle={{ color: "#eaebed" }}
        containerStyle={{
          backgroundColor: "transparent",
          fontSize: 15,
        }}
      ></Send>
    );
  };
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
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={renderChatFooter}
        renderBubble={renderBubble}
        renderTime={renderTime}
        renderSend={renderSendButton}
      />
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme === "dark" ? "#1f1f1f" : "#eaebed",
      justifyContent: "space-between",
      paddingLeft: 10,
      paddingRight: 10,
      flex: 1,
    },
  });
