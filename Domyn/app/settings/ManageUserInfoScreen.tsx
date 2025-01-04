import React, { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function ManageUserInformation() {
    const router = useRouter();

    // States to store user input
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [heightFeet, setHeightFeet] = useState("");
    const [heightInches, setHeightInches] = useState("");

    const handleSubmit = () => {
        // Send this data to another page or an API in the future
        console.log({
            firstName,
            middleName,
            lastName,
            age,
            weight,
            height: `${heightFeet}ft ${heightInches}in`,
        });

        // Navigate back to the settings page
        router.push("/settings/SettingsScreen")
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                // Header
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>&lt; Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>

                // Title 
                <Text style={styles.title}>Manage User Information</Text>

                // Name section 
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Name</Text>
                    <View style={styles.inputGroup}>
                        <TextInput style={styles.input} placeholder="First" placeholderTextColor="gray" value={firstName} onChangeText={setFirstName}/>
                        <TextInput style={styles.input} placeholder="Middle (optional)" placeholderTextColor="gray" value={middleName} onChangeText={setMiddleName}/>
                        <TextInput style={styles.input} placeholder="Last" placeholderTextColor="gray" value={lastName} onChangeText={setLastName}/>
                    </View>
                </View>

                // Age section
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Age</Text>
                    <TextInput style={styles.singleInput} placeholder="Age" placeholderTextColor="gray" keyboardType="numeric" value={age} onChangeText={setAge}/>
                </View>

                // Weight section
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weight</Text>
                    <TextInput style={styles.singleInput} placeholder="lbs" placeholderTextColor="gray" keyboardType="numeric" value={weight} onChangeText={setWeight}/>
                </View>

                // Height section
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Height</Text>
                    <View style={styles.inputGroup}>
                        <TextInput style={styles.input} placeholder="Feet" placeholderTextColor="gray" keyboardType="numeric" value={heightFeet} onChangeText={setHeightFeet}/>
                        <TextInput style={styles.input} placeholder="Inches" placeholderTextColor="gray" keyboardType="numeric" value={heightInches} onChangeText={setHeightInches}/>
                    </View>
                </View>

                // Footer
                <Text style={styles.footer}>Domyn</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    scrollContainer: {
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
    },
    backText: {
        fontSize: 16,
        color: "white",
        marginTop: 40,
    },
    doneText: {
        fontSize: 16,
        color: "black",
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 15,
        fontWeight: "bold",
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    inputGroup: {
        backgroundColor: "#1C1C1E",
        borderRadius: 10,
        padding: 10,
    },
    input: {
        backgroundColor: "#1C1C1E",
        color: "white",
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        marginBottom: 10,
        padding: 10,
    },
    singleInput: {
        backgroundColor: "#1C1C1E",
        color: "white",
        fontSize: 16,
        borderRadius: 10,
        padding: 10,
    },
    footer: {
        textAlign: "center",
        color: "white",
        fontSize: 14,
        marginTop: 20,
    },
});