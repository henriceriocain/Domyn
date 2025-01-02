import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Domyn</Text>
      <Text style={styles.subheader}>Welcome To Your Fitness Domain</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/PersonalDetailsScreen")}>
        <Text style={styles.buttonText}>Get Started</Text>
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
    fontSize: 70,
    fontWeight: 800,
    marginBottom: 30,
    color: "white",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 20,
    color: "white",
  },
  button: {
    backgroundColor: "#2E3140", 
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: "white", 
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
