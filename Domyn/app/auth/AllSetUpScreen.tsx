// app / auth / AllSetUpScreen.tsx

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function AllSetUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>You're all set up!</Text>
      <Text style={styles.subheader}>Let's take a peek at your new home.</Text>
      <TouchableOpacity
        style={styles.domainButton}
        onPress={() => router.push("./LoginScreen")}
      >
        <Text style={styles.domainButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  header: {
    fontSize: 40,
    fontWeight: "700",
    color: "white",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    color: "white",
    marginBottom: 30,
  },
  domainButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  domainButtonText: {
    color: "#2E3140",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
