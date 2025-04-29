"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAuth } from "@clerk/clerk-expo"
import HomeScreen from "../screens/HomeScreen"
import WallpaperDetailScreen from "../screens/WallpaperScreen"
import ProfileScreen from "../screens/ProfileScreen"
import AuthScreen from "../screens/AuthScreen"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Home, User } from "lucide-react-native"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  )
}

export default function MainNavigator() {
  const { isSignedIn, isLoaded } = useAuth()

  // Show a loading screen if Clerk is still loading
  if (!isLoaded) {
    return null
  }

  return (
    <Stack.Navigator>
      {isSignedIn ? (
        <>
          <Stack.Screen name="Main" component={AuthenticatedTabs} options={{ headerShown: false }} />
          <Stack.Screen name="WallpaperDetail" component={WallpaperDetailScreen} options={{ title: "Wallpaper" }} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  )
}
