"use client"

import { useEffect } from "react"
import { useRouter } from "expo-router"
import { View, ActivityIndicator } from "react-native"
import { useAuth } from "@clerk/clerk-expo"
import Animated, { FadeIn } from "react-native-reanimated"

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/(tabs)")
      } else {
        router.replace("/auth")
      }
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9fafb" }}>
        <Animated.View entering={FadeIn.duration(800)}>
          <ActivityIndicator size="large" color="#0ea5e9" />
        </Animated.View>
      </View>
    )
  }

  // This will never be rendered, but it's needed for type safety
  return null
}
