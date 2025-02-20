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
        onPress={() => router.push("/home/centralHome")}
      >
        <Text style={styles.domainButtonText}>Enter Your Domain</Text>
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
    fontSize: 32,
    fontWeight: "600",
    color: "white",
    marginBottom: 10,
  },
  subheader: {
    fontSize: 20,
    color: "white",
    marginBottom: 40,
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
