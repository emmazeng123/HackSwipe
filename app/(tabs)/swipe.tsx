import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebaseConfig";

const SWIPE_THRESHOLD = 120;

const testProfiles = [
  {
    uid: "demo-alex",
    firstName: "Demo Alex",
    roles: ["Backend", "AI / ML"],
    experienceLevel: "Intermediate",
    isDemo: true,
  },
  {
    uid: "demo-jamie",
    firstName: "Demo Jamie",
    roles: ["Frontend", "UI/UX"],
    experienceLevel: "Beginner",
    isDemo: true,
  },
  {
    uid: "demo-sam",
    firstName: "Demo Sam",
    roles: ["Full-stack", "Data"],
    experienceLevel: "Advanced",
    isDemo: true,
  },
];

export default function SwipeScreen() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Position of the card while the user drags it
  const pan = useRef(new Animated.ValueXY()).current;

  const profile = testProfiles[currentIndex];

  useEffect(() => {
    setLoading(false);
  }, []);

  // Reset card position when we move to a new profile
  const resetCardPosition = () => {
    pan.setValue({ x: 0, y: 0 });
  };

  // Move to the next profile
  const showNextProfile = () => {
    resetCardPosition();

    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  // Handle a like
  const handleLike = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser || !profile) {
      return;
    }

    const myUid = currentUser.uid;
    const otherUserId = profile.uid;

    console.log("My UID:", myUid);
    console.log("Liked:", otherUserId);

    // For now, all demo profiles immediately match
    if (profile.isDemo) {
      Alert.alert(
        "It's a Match! 🔥",
        `You matched with ${profile.firstName}!`
      );
    }

    showNextProfile();
  };

  // Handle a pass
  const handlePass = () => {
    if (!profile) {
      return;
    }

    console.log("Passed:", profile.uid);

    showNextProfile();
  };

  // Swipe card off the screen
  const swipeCard = (direction: "left" | "right") => {
    const x = direction === "right" ? 500 : -500;

    Animated.timing(pan, {
      toValue: {
        x,
        y: 0,
      },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (direction === "right") {
        handleLike();
      } else {
        handlePass();
      }
    });
  };

  // Detect the user's finger movement
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },

      onPanResponderMove: (_, gestureState) => {
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeCard("right");
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          swipeCard("left");
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Card rotation based on horizontal movement
  const rotate = pan.x.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const animatedCardStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      { rotate },
    ],
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // No more demo profiles
  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No more profiles</Text>
          <Text style={styles.emptyText}>
            You've gone through all the demo profiles.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HackSwipe</Text>

        <View style={styles.cardArea}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.card, animatedCardStyle]}
          >
            <View>
              <Text style={styles.name}>{profile.firstName}</Text>

              <Text style={styles.roles}>
                {profile.roles.join(" • ")}
              </Text>

              <Text style={styles.experience}>
                {profile.experienceLevel}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.passButton}
            onPress={() => swipeCard("left")}
          >
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => swipeCard("right")}
          >
            <Text style={styles.buttonText}>❤️</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 30,
  },

  cardArea: {
    width: "100%",
    height: 400,
  },

  card: {
    width: "100%",
    height: 400,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "flex-end",

    // Small shadow for the card
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },

  roles: {
    fontSize: 17,
    marginBottom: 6,
  },

  experience: {
    fontSize: 16,
  },

  actions: {
    flexDirection: "row",
    gap: 30,
    marginTop: 30,
  },

  passButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 30,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});