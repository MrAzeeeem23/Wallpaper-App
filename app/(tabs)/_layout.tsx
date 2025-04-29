"use client"

import { Tabs } from "expo-router"
import { useAuth } from "@clerk/clerk-expo"
import { Redirect } from "expo-router"
import { Home, Heart, User, Search, Upload } from "lucide-react-native"
import { useTheme } from "../../provider/ThemeProvider"

export default function TabsLayout() {
  const { isSignedIn } = useAuth()
  const { colors } = useTheme()

  if (!isSignedIn) {
    return <Redirect href="/auth" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium",
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size }) => <Upload color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
