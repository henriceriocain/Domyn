// app / auth / WelcomeScreen.tsx

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Domyn</Text>
      <Text style={styles.subheader}>Welcome To Your Fitness Domain</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/auth/CredentialsScreen")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/auth/LoginScreen")}
      >
        <Text style={styles.loginButtonText}>Login</Text>
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
    fontWeight: "800",
    marginBottom: -5,
    color: "white",
  },
  subheader: {
    fontSize: 18,
    marginBottom: 40,
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
  orText: {
    color: "white",
    fontSize: 16,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  loginButtonText: {
    color: "#2E3140",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
