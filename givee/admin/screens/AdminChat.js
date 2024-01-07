import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons/faCircleChevronLeft";

import { useNavigation } from "@react-navigation/native";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Time,
} from "react-native-gifted-chat";

export default function AdminChat({ route }) {
  const db = FIREBASE_DB;
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const recipientEmail = route.params ? route.params.email : null;

  const adminUser = {
    _id: "andreeacgabor@gmail.com",
    name: "Andreea Gabor",
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, "chats"),
          where("user._id", "in", [adminUser._id, recipientEmail]),
          where("recipient", "in", [adminUser._id, recipientEmail])
        );

        const querySnapshot = await getDocs(messagesQuery);
        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt,
          user: doc.data().user,
        }));

        setMessages(
          fetchedMessages.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error("Eroare la recuperarea mesajelor: ", error);
      }
    };

    fetchMessages();
  }, [db, recipientEmail]);

  const onSend = useCallback(
    async (messages = []) => {
      try {
        const { _id, createdAt, text } = messages[0];

        const messageForFirebase = {
          _id,
          createdAt: createdAt.toISOString(),
          text,
          user: adminUser,
          recipient: recipientEmail,
        };
        const newChat = doc(collection(db, "chats"));

        await setDoc(newChat, messageForFirebase);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );
      } catch (error) {
        console.error("Eroare la trimiterea mesajului: ", error);
      }
    },
    [db, recipientEmail]
  );

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "#1f1f1f",
          borderTopColor: "#e2e2e2",
          borderTopWidth: 1,
          padding: 8,
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
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: "andreeacgabor@gmail.com",
          name: "Andreea Gabor",
        }}
        renderInputToolbar={renderInputToolbar}
        renderChatFooter={renderChatFooter}
        renderBubble={renderBubble}
        renderTime={renderTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#1f1f1f",
    justifyContent: "space-between",
    flex: 1,
  },
  goBackButton: {
    marginTop: 70,
    marginRight: 330,
    marginLeft: 20,
  },
  goBackIcon: {
    color: "#eaebed",
  },
});
