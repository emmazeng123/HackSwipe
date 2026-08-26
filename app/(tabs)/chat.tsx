import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebaseConfig";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const chatId = "demo-chat";

  const handleSend = async () => {
    // if no character
    if (!message.trim()) {
      return;
    }

    // authenticate user 
    const currentUser = auth.currentUser;

    if (!currentUser) {
        return;
    }

    await addDoc(
        collection(db, "chats", chatId, "messages"),
        {
            senderId: currentUser.uid ,
            text: message.trim(),
            createdAt: serverTimestamp(),
        }
    )

    // send 
    console.log("Sending:", message);

    // clears enter 
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Demo Alex</Text>
      </View>

      <View style={styles.messages}>
        <Text>No messages yet.</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
  },

  messages: {
    flex: 1,
    padding: 20,
  },

  inputRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  sendButton: {
    paddingHorizontal: 18,
    justifyContent: "center",
    backgroundColor: "#111",
    borderRadius: 14,
  },

  sendText: {
    color: "#fff",
    fontWeight: "700",
  },
});