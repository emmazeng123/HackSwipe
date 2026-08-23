import { useState } from "react";

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing information",
        "Enter an email and password."
      );
      return;
    }

    try {
      // Sign up
      if (isSignUp) {
        await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        Alert.alert(
          "Success",
          "Your HackSwipe account was created!"
        );

        router.push("/setup-profile");
        return;
      }

      // Log in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Get the UID Firebase Authentication gave this user
      const uid = userCredential.user.uid;

      // Point to this user's Firestore profile
      const userRef = doc(db, "users", uid);

      // Retrieve the profile
      const userSnapshot = await getDoc(userRef);

      // Check whether profile setup was completed
      if (
        userSnapshot.exists() &&
        userSnapshot.data().profileComplete === true
      ) {
        // Profile exists and is complete
        router.push("/(tabs)/swipe");
      } else {
        // Account exists, but profile setup is incomplete
        router.push("/setup-profile");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>HackSwipe</Text>

        <Text style={styles.tagline}>
          Find your perfect hackathon teammate.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
        >
          <Text style={styles.buttonText}>
            {isSignUp ? "Create Account" : "Log In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </Text>
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

  content: {
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },

  logo: {
    fontSize: 38,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  tagline: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    height: 55,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  switchText: {
    textAlign: "center",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "600",
  },
});