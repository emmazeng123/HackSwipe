import { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

// save 2 database
import { Alert } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function ProfileSetupScreen() {
  // user info 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hackathonName, setHackathonName] = useState("");

  // roles 
  const [rolesSelected, setRolesSelected] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");

  const roles = [
    "Frontend",
    "Backend",
    "Full-stack",
    "UI/UX",
    "AI / ML",
    "Data",
    "Product",
  ];

  const experienceLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  // select/deselect role 
  const toggleRole = (role: string) => {
    if (rolesSelected.includes(role)) {
      setRolesSelected(
        rolesSelected.filter((selectedRole) => selectedRole !== role)
      );
    } else {
      setRolesSelected([...rolesSelected, role]);
    }
  };

  const handleContinue = async () => {
  // Make sure required fields are filled out
  if (
    !firstName ||
    !lastName ||
    rolesSelected.length === 0 ||
    !experienceLevel
  ) {
    Alert.alert(
      "Missing information",
      "Please complete all profile fields."
    );
    return;
  }

  // get the currently logged-in user
  const user = auth.currentUser;

  if (!user) {
    Alert.alert("Error", "You must be logged in.");
    return;
  }

  try {
    // save selected under this user's UID
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      roles: rolesSelected,
      experienceLevel: experienceLevel,
      profileComplete: true
    });
    Alert.alert("Success", "Profile saved!");
  } catch (error: any) {
    Alert.alert("Error", error.message);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.title}>Build your profile</Text>

        {/* First Name */}
        <TextInput
          style={styles.input}
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
        />

        {/* Last Name */}
        <TextInput
          style={styles.input}
          placeholder="Last name"
          value={lastName}
          onChangeText={setLastName}
        />

        {/* Hackathon */}
        <Text style={styles.sectionTitle}>
          Which hackathon are you attending?
        </Text>

        <TextInput
          style={styles.input}
          placeholder="e.g., LA Hacks 2026"
          value={hackathonName}
          onChangeText={setHackathonName}
        />

        {/* Roles */}
        <Text style={styles.sectionTitle}>
          What are your roles? Select all that apply.
        </Text>

        <View style={styles.optionContainer}>
          {roles.map((role) => {
            const isSelected = rolesSelected.includes(role);

            return (
              <TouchableOpacity
                key={role}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => toggleRole(role)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Experience Level */}
        <Text style={styles.sectionTitle}>
          What's your experience level?
        </Text>

        <View style={styles.optionContainer}>
          {experienceLevels.map((level) => {
            const isSelected = experienceLevel === level;

            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => setExperienceLevel(level)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Continue Button */}
        <TouchableOpacity style={styles.button}
        onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 28,
    paddingBottom: 50,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 30,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 15,
  },

  optionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  optionButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  selectedOption: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  optionText: {
    fontSize: 15,
  },

  selectedOptionText: {
    color: "#fff",
  },

  button: {
    height: 55,
    backgroundColor: "#111",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});