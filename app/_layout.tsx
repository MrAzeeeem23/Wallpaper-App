"use client"

import { ClerkProvider } from "@clerk/clerk-expo"
import { Slot } from "expo-router"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import { View, Text } from "react-native"
import * as SecureStore from "expo-secure-store"
import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { WallpaperProvider } from "../provider/WallpaperProvider"
import { ThemeProvider, useTheme } from "../provider/ThemeProvider"

// Replace with your Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_aGVscGZ1bC1idWNrLTEuY2xlcmsuYWNjb3VudHMuZGV2JA"

// Storage for Clerk token
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key)
    } catch (err) {
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

function AppWithTheme() {
  const { colors } = useTheme()

  return (
    <WallpaperProvider>
      <StatusBar style={colors.statusBar as any} />
      <Slot />
    </WallpaperProvider>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  })

  useEffect(() => {
    // Initialize sample wallpapers in AsyncStorage if not already present
    const initializeWallpapers = async () => {
      const wallpapersExist = await AsyncStorage.getItem("wallpapers")
      if (!wallpapersExist) {
        await AsyncStorage.setItem("wallpapers", JSON.stringify(sampleWallpapers))
      }
    }

    initializeWallpapers()
  }, [])

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppWithTheme />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  )
}

// Sample wallpapers data
const sampleWallpapers = [
  {
    id: "1",
    title: "Mountain Sunset",
    category: "Nature",
    description: "Beautiful mountain sunset with vibrant colors.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    downloads: 1245,
    isUserUploaded: false,
  },
  {
    id: "2",
    title: "Ocean Waves",
    category: "Nature",
    description: "Calming ocean waves on a sunny day.",
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop",
    downloads: 987,
    isUserUploaded: false,
  },
  {
    id: "3",
    title: "Neon City",
    category: "Urban",
    description: "Vibrant neon city lights at night.",
    imageUrl: "https://images.unsplash.com/photo-1545843364-9e5b5b8fa511?w=800&auto=format&fit=crop",
    downloads: 2341,
    isUserUploaded: false,
  },
  {
    id: "4",
    title: "Abstract Art",
    category: "Abstract",
    description: "Colorful abstract art pattern.",
    imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop",
    downloads: 765,
    isUserUploaded: false,
  },
  {
    id: "5",
    title: "Desert Dunes",
    category: "Nature",
    description: "Golden desert dunes at sunset.",
    imageUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&auto=format&fit=crop",
    downloads: 1098,
    isUserUploaded: false,
  },
  {
    id: "6",
    title: "Space Galaxy",
    category: "Space",
    description: "Stunning view of a distant galaxy.",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
    downloads: 3210,
    isUserUploaded: false,
  },
  {
    id: "7",
    title: "Tropical Beach",
    category: "Nature",
    description: "Pristine tropical beach with palm trees.",
    imageUrl: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&auto=format&fit=crop",
    downloads: 1876,
    isUserUploaded: false,
  },
  {
    id: "8",
    title: "Minimalist",
    category: "Minimal",
    description: "Clean minimalist design in soft colors.",
    imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop",
    downloads: 954,
    isUserUploaded: false,
  },
]



// "use client"

// import { ClerkProvider } from "@clerk/clerk-expo"
// import { Slot } from "expo-router"
// import { useFonts } from "expo-font"
// import { StatusBar } from "expo-status-bar"
// import { View, Text } from "react-native"
// import * as SecureStore from "expo-secure-store"
// import { useEffect } from "react"
// import { GestureHandlerRootView } from "react-native-gesture-handler"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import { WallpaperProvider } from "../provider/WallpaperProvider"

// // Replace with your Clerk publishable key
// const CLERK_PUBLISHABLE_KEY = "pk_test_aGVscGZ1bC1idWNrLTEuY2xlcmsuYWNjb3VudHMuZGV2JA"

// // Storage for Clerk token
// const tokenCache = {
//   async getToken(key: string) {
//     try {
//       return SecureStore.getItemAsync(key)
//     } catch (err) {
//       return null
//     }
//   },
//   async saveToken(key: string, value: string) {
//     try {
//       return SecureStore.setItemAsync(key, value)
//     } catch (err) {
//       return
//     }
//   },
// }

// export default function RootLayout() {
//   const [fontsLoaded] = useFonts({
//     "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
//     "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
//     "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
//     "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
//   })

//   useEffect(() => {
//     // Initialize sample wallpapers in AsyncStorage if not already present
//     const initializeWallpapers = async () => {
//       const wallpapersExist = await AsyncStorage.getItem("wallpapers")
//       if (!wallpapersExist) {
//         await AsyncStorage.setItem("wallpapers", JSON.stringify(sampleWallpapers))
//       }
//     }

//     initializeWallpapers()
//   }, [])

//   if (!fontsLoaded) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <Text>Loading...</Text>
//       </View>
//     )
//   }

//   return (
//     <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <WallpaperProvider>
//           <StatusBar style="dark" />
//           <Slot />
//         </WallpaperProvider>
//       </GestureHandlerRootView>
//     </ClerkProvider>
//   )
// }

// // Sample wallpapers data
// const sampleWallpapers = [
//   {
//     id: "1",
//     title: "Mountain Sunset",
//     category: "Nature",
//     description: "Beautiful mountain sunset with vibrant colors.",
//     imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
//     downloads: 1245,
//   },
//   {
//     id: "2",
//     title: "Ocean Waves",
//     category: "Nature",
//     description: "Calming ocean waves on a sunny day.",
//     imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop",
//     downloads: 987,
//   },
//   {
//     id: "3",
//     title: "Neon City",
//     category: "Urban",
//     description: "Vibrant neon city lights at night.",
//     imageUrl: "https://images.unsplash.com/photo-1545843364-9e5b5b8fa511?w=800&auto=format&fit=crop",
//     downloads: 2341,
//   },
//   {
//     id: "4",
//     title: "Abstract Art",
//     category: "Abstract",
//     description: "Colorful abstract art pattern.",
//     imageUrl: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop",
//     downloads: 765,
//   },
//   {
//     id: "5",
//     title: "Desert Dunes",
//     category: "Nature",
//     description: "Golden desert dunes at sunset.",
//     imageUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&auto=format&fit=crop",
//     downloads: 1098,
//   },
//   {
//     id: "6",
//     title: "Space Galaxy",
//     category: "Space",
//     description: "Stunning view of a distant galaxy.",
//     imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop",
//     downloads: 3210,
//   },
//   {
//     id: "7",
//     title: "Tropical Beach",
//     category: "Nature",
//     description: "Pristine tropical beach with palm trees.",
//     imageUrl: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&auto=format&fit=crop",
//     downloads: 1876,
//   },
//   {
//     id: "8",
//     title: "Minimalist",
//     category: "Minimal",
//     description: "Clean minimalist design in soft colors.",
//     imageUrl: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop",
//     downloads: 954,
//   },
// ]
