"use client"

import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, Switch } from "react-native"
import { useAuth, useUser } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import Animated, { FadeInDown } from "react-native-reanimated"
import { LogOut, Settings, HelpCircle, Info, Download, Heart, Moon, Sun } from "lucide-react-native"
import { useWallpapers } from "../../provider/WallpaperProvider"
import { useTheme } from "../../provider/ThemeProvider"

export default function ProfileScreen() {
  const { signOut } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const { favorites, downloads } = useWallpapers()
  const { colors, isDark, toggleTheme, theme, setTheme } = useTheme()

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
      icon: <Settings size={20} color={colors.subtext} />,
      title: "Account Settings",
      subtitle: "Manage your account details",
      action: () => {},
    },
    {
      icon: <HelpCircle size={20} color={colors.subtext} />,
      title: "Help & Support",
      subtitle: "Get help with the app",
      action: () => {},
    },
    {
      icon: <Info size={20} color={colors.subtext} />,
      title: "About",
      subtitle: "App information and credits",
      action: () => {},
    },
    {
      icon: <LogOut size={20} color={colors.danger} />,
      title: "Sign Out",
      subtitle: "Log out from your account",
      action: handleSignOut,
      danger: true,
    },
  ]

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={[styles.profileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Image
            source={{ uri: user?.imageUrl || "/placeholder.svg?height=100&width=100" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.fullName || "User"}</Text>
            <Text style={[styles.profileEmail, { color: colors.subtext }]}>
              {user?.primaryEmailAddress?.emailAddress || ""}
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(600).delay(200)}
          style={[styles.statsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.statItem}>
            <Heart size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{favorites.length}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Favorites</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Download size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{downloads.length}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Downloads</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(600).delay(300)}
        style={[styles.themeContainer, { backgroundColor: colors.card }]}
      >
        <View style={styles.themeHeader}>
          <View style={styles.themeIconContainer}>
            {isDark ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.primary} />}
          </View>
          <View style={styles.themeTextContainer}>
            <Text style={[styles.themeTitle, { color: colors.text }]}>Dark Mode</Text>
            <Text style={[styles.themeSubtitle, { color: colors.subtext }]}>
              {isDark ? "Dark theme is enabled" : "Light theme is enabled"}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={"#f4f3f4"}
          />
        </View>

        <View style={[styles.themeOptions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.themeOption, theme === "light" && styles.selectedThemeOption]}
            onPress={() => setTheme("light")}
          >
            <Text style={[styles.themeOptionText, { color: theme === "light" ? colors.primary : colors.text }]}>
              Light
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeOption, theme === "dark" && styles.selectedThemeOption]}
            onPress={() => setTheme("dark")}
          >
            <Text style={[styles.themeOptionText, { color: theme === "dark" ? colors.primary : colors.text }]}>
              Dark
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeOption, theme === "system" && styles.selectedThemeOption]}
            onPress={() => setTheme("system")}
          >
            <Text style={[styles.themeOptionText, { color: theme === "system" ? colors.primary : colors.text }]}>
              System
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Animated.View key={item.title} entering={FadeInDown.duration(600).delay(400 + index * 100)}>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.card }]}
              onPress={item.action}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>{item.icon}</View>
              <View style={styles.menuContent}>
                <Text style={[styles.menuTitle, { color: item.danger ? colors.danger : colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.menuSubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.subtext }]}>WallHub v1.0.0</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
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
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  statDivider: {
    width: 1,
  },
  themeContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  themeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  themeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  themeTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  themeSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  themeOptions: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  themeOption: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  selectedThemeOption: {
    borderBottomWidth: 2,
    borderBottomColor: "#0ea5e9",
  },
  themeOptionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
})
