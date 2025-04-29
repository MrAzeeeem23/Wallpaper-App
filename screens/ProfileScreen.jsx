"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { useAuth, useUser } from "@clerk/clerk-expo"

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
      Alert.alert("Error", "Failed to sign out. Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.imageUrl || "/placeholder.svg?height=100&width=100" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.fullName || "User"}</Text>
        <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress || ""}</Text>
      </View>

      <View style={styles.settingsContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Account Settings</Text>
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, styles.signOutButton]} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  profileHeader: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profileEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  settingText: {
    fontSize: 16,
    color: "#4b5563",
  },
  signOutButton: {
    marginTop: 20,
  },
  signOutText: {
    fontSize: 16,
    color: "#ef4444",
    fontWeight: "500",
  },
})
