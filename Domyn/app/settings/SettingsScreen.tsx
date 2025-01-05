import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SettingsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Settings</Text>

            {/* Profile Settings Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Settings</Text>

                <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/ManageUserInfoScreen")}>
                <Text style={styles.itemText}>Manage User Information</Text>
                <Text style={styles.arrow}>&gt;</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/EditScheduleScreen")}>
                <Text style={styles.itemText}>Edit Schedule</Text>
                <Text style={styles.arrow}>&gt;</Text>
                </TouchableOpacity>
            </View>

            {/* Other section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Other</Text>

                <TouchableOpacity style={styles.item} onPress={() => router.push("/settings/FaqScreen")}>
                <Text style={styles.itemText}>FAQ</Text>
                <Text style={styles.arrow}>&gt;</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>Domyn</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        padding: 20,
        paddingTop: 80,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 70,
    },
    section: {
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        marginBottom: 30,
        padding: 15,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
      },
      item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
      },
      itemText: {
        fontSize: 16,
        color: "white",
      },
      arrow: {
        color: "white",
        fontSize: 16,
      },
      footer: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "white",
        fontSize: 14,
      },
});