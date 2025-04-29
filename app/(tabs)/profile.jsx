"use client"

import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from "react-native"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import Animated, { FadeInDown } from "react-native-reanimated"
import { LogOut, Settings, HelpCircle, Info, Download, Heart } from "lucide-react-native"
import { useWallpapers } from "../../provider/WallpaperProvider"

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { favorites, downloads } = useWallpapers()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace("/auth")
    } catch (error) {
      console.error("Error signing out:", error)
      Alert.alert("Error", "Failed to sign out. Please try again.")
    }
  }

  const menuItems = [
    {
      icon: <Settings size={20} color="#64748b" />,
      title: "Account Settings",
      subtitle: "Manage your account details",
      action: () => {},
    },
    {
      icon: <HelpCircle size={20} color="#64748b" />,
      title: "Help & Support",
      subtitle: "Get help with the app",
      action: () => {},
    },
    {
      icon: <Info size={20} color="#64748b" />,
      title: "About",
      subtitle: "App information and credits",
      action: () => {},
    },
    {
      icon: <LogOut size={20} color="#ef4444" />,
      title: "Sign Out",
      subtitle: "Log out from your account",
      action: handleSignOut,
      danger: true,
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.profileHeader}>
          <Image
            source={{ uri: user?.imageUrl || "/placeholder.svg?height=100&width=100" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName || "User"}</Text>
            <Text style={styles.profileEmail}>{user?.primaryEmailAddress?.emailAddress || ""}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Heart size={20} color="#0ea5e9" />
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Download size={20} color="#0ea5e9" />
            <Text style={styles.statValue}>{downloads.length}</Text>
            <Text style={styles.statLabel}>Downloads</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View key={item.title} entering={FadeInDown.duration(600).delay(300 + index * 100)}>
            <TouchableOpacity style={styles.menuItem} onPress={item.action} activeOpacity={0.7}>
              <View style={styles.menuIcon}>{item.icon}</View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, item.danger && styles.dangerText]}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>WallHub v1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#1e293b",
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748b",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#1e293b",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748b",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    marginLeft: 16,
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#1e293b",
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748b",
    marginTop: 2,
  },
  dangerText: {
    color: "#ef4444",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#94a3b8",
  },
})
