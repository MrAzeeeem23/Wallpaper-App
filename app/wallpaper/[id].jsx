"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Share,
  Linking,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useWallpapers } from "../../provider/WallpaperProvider"
import { StatusBar } from "expo-status-bar"
import { BlurView } from "expo-blur"
import { ArrowLeft, Heart, Download, Share2, Image as ImageIcon } from "lucide-react-native"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"
import * as IntentLauncher from "expo-intent-launcher"
import * as Sharing from "expo-sharing"
import Animated, { FadeIn } from "react-native-reanimated"

export default function WallpaperDetailScreen() {
  const { id } = useLocalSearchParams()
  const { wallpapers, favorites, toggleFavorite, addDownload } = useWallpapers()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const wallpaper = wallpapers.find((w) => w.id === id)
  const isFavorite = favorites.includes(wallpaper?.id)

  if (!wallpaper) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Wallpaper not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please grant media library permissions to save wallpapers.", [{ text: "OK" }])
      return false
    }
    return true
  }

  const downloadWallpaper = async () => {
    try {
      setLoading(true)
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        setLoading(false)
        return
      }

      const fileUri = FileSystem.documentDirectory + wallpaper.title.replace(/\s+/g, "_") + ".jpg"
      const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri)

      if (downloadResult.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
        await MediaLibrary.createAlbumAsync("Wallpapers", asset, false)
        addDownload(wallpaper.id)
        Alert.alert("Success", "Wallpaper saved to your gallery!")
      } else {
        Alert.alert("Error", "Failed to download wallpaper.")
      }
    } catch (error) {
      console.error("Error downloading wallpaper:", error)
      Alert.alert("Error", "Failed to download wallpaper.")
    } finally {
      setLoading(false)
    }
  }

  const setAsWallpaper = async () => {
    try {
      setLoading(true)
      const hasPermission = await requestPermissions()
      if (!hasPermission) {
        setLoading(false)
        return
      }

      // First download the image
      const fileUri = FileSystem.documentDirectory + wallpaper.title.replace(/\s+/g, "_") + ".jpg"
      const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri)

      if (downloadResult.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
        addDownload(wallpaper.id)
        
        if (Platform.OS === "android") {
          // On Android, use Intent to open the wallpaper picker
          try {
            const contentUri = await MediaLibrary.getContentUriAsync(asset)
            await IntentLauncher.startActivityAsync("android.intent.action.ATTACH_DATA", {
              data: contentUri,
              type: "image/jpeg",
              flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
            })
          } catch (intentError) {
            console.error("Intent error:", intentError)
            // Fallback method: Share the image
            await Sharing.shareAsync(downloadResult.uri, {
              dialogTitle: "Set As Wallpaper",
              mimeType: "image/jpeg",
              UTI: "public.jpeg",
            })
            Alert.alert(
              "Set as Wallpaper",
              "Please use your device's built-in options to set this image as wallpaper.",
              [{ text: "OK" }]
            )
          }
        } else {
          // On iOS, save to gallery and guide the user
          Alert.alert(
            "Wallpaper Saved",
            "The wallpaper has been saved to your Photos app. To set as wallpaper:\n\n1. Open the Photos app\n2. Find this image\n3. Tap the share icon\n4. Select 'Use as Wallpaper'",
            [
              { text: "Open Photos", onPress: () => Linking.openURL("photos-redirect://") },
              { text: "OK" }
            ]
          )
        }
      } else {
        Alert.alert("Error", "Failed to download wallpaper.")
      }
    } catch (error) {
      console.error("Error setting wallpaper:", error)
      Alert.alert("Error", "Failed to set wallpaper.")
    } finally {
      setLoading(false)
    }
  }

  const shareWallpaper = async () => {
    try {
      await Share.share({
        message: `Check out this amazing wallpaper: ${wallpaper.title}`,
        url: wallpaper.imageUrl,
      })
    } catch (error) {
      console.error("Error sharing wallpaper:", error)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={{ uri: wallpaper.imageUrl }} style={styles.wallpaperImage} />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={() => toggleFavorite(wallpaper.id)}
      >
        <Heart size={24} color="white" fill={isFavorite ? "#ef4444" : "transparent"} />
      </TouchableOpacity>

      <Animated.View entering={FadeIn.duration(800)} style={styles.bottomSheet}>
        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.title}>{wallpaper.title}</Text>
            <Text style={styles.category}>{wallpaper.category}</Text>
            <Text style={styles.description}>{wallpaper.description}</Text>
            <Text style={styles.downloads}>{wallpaper.downloads} downloads</Text>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={downloadWallpaper} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Download size={20} color="white" />
                    <Text style={styles.actionButtonText}>Download</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.applyButton]}
                onPress={setAsWallpaper}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <ImageIcon size={20} color="white" />
                    <Text style={styles.actionButtonText}>Set as Wallpaper</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={shareWallpaper}>
                <Share2 size={20} color="white" />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BlurView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  wallpaperImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  favoriteButton: {
    position: "absolute",
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  favoriteButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  blurContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailsContainer: {
    padding: 24,
    maxHeight: 400,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "white",
  },
  category: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 12,
    lineHeight: 22,
  },
  downloads: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 12,
  },
  actionsContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#0ea5e9",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: "#10b981",
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: "#8b5cf6",
    marginRight: 0,
  },
  actionButtonText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#1e293b",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#0ea5e9",
  },
})

// "use client"

// import { useState } from "react"
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   Share,
// } from "react-native"
// import { useLocalSearchParams, useRouter } from "expo-router"
// import { useWallpapers } from "../../provider/WallpaperProvider"
// import { StatusBar } from "expo-status-bar"
// import { BlurView } from "expo-blur"
// import { ArrowLeft, Heart, Download, Share2, Image as ImageIcon } from "lucide-react-native"
// import * as FileSystem from "expo-file-system"
// import * as MediaLibrary from "expo-media-library"
// // import * as Wallpaper from "expo-wallpaper"
// import Animated, { FadeIn } from "react-native-reanimated"

// export default function WallpaperDetailScreen() {
//   const { id } = useLocalSearchParams()
//   const { wallpapers, favorites, toggleFavorite, addDownload } = useWallpapers()
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const wallpaper = wallpapers.find((w) => w.id === id)
//   const isFavorite = favorites.includes(wallpaper?.id)

//   if (!wallpaper) {
//     return (
//       <View style={styles.notFoundContainer}>
//         <Text style={styles.notFoundText}>Wallpaper not found</Text>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Text style={styles.backButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     )
//   }

//   const requestPermissions = async () => {
//     const { status } = await MediaLibrary.requestPermissionsAsync()
//     if (status !== "granted") {
//       Alert.alert("Permission Required", "Please grant media library permissions to save wallpapers.", [{ text: "OK" }])
//       return false
//     }
//     return true
//   }

//   const downloadWallpaper = async () => {
//     try {
//       setLoading(true)
//       const hasPermission = await requestPermissions()
//       if (!hasPermission) {
//         setLoading(false)
//         return
//       }

//       const fileUri = FileSystem.documentDirectory + wallpaper.title.replace(/\s+/g, "_") + ".jpg"
//       const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri)

//       if (downloadResult.status === 200) {
//         const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
//         await MediaLibrary.createAlbumAsync("Wallpapers", asset, false)
//         addDownload(wallpaper.id)
//         Alert.alert("Success", "Wallpaper saved to your gallery!")
//       } else {
//         Alert.alert("Error", "Failed to download wallpaper.")
//       }
//     } catch (error) {
//       console.error("Error downloading wallpaper:", error)
//       Alert.alert("Error", "Failed to download wallpaper.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const setAsWallpaper = async () => {
//     try {
//       setLoading(true)
//       const hasPermission = await requestPermissions()
//       if (!hasPermission) {
//         setLoading(false)
//         return
//       }

//       // First download the image
//       const fileUri = FileSystem.documentDirectory + wallpaper.title.replace(/\s+/g, "_") + ".jpg"
//       const downloadResult = await FileSystem.downloadAsync(wallpaper.imageUrl, fileUri)

//       if (downloadResult.status === 200) {
//         if (Platform.OS === "android") {
//           // On Android, we can set the wallpaper directly
//           await Wallpaper.setWallpaperAsync(downloadResult.uri)
//           addDownload(wallpaper.id)
//           Alert.alert("Success", "Wallpaper applied successfully!")
//         } else {
//           // On iOS, we need to save it to the gallery and guide the user
//           const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
//           addDownload(wallpaper.id)
//           Alert.alert(
//             "Wallpaper Saved",
//             "The wallpaper has been saved to your gallery. Please go to Settings > Wallpaper to set it as your wallpaper.",
//             [{ text: "OK" }],
//           )
//         }
//       } else {
//         Alert.alert("Error", "Failed to download wallpaper.")
//       }
//     } catch (error) {
//       console.error("Error setting wallpaper:", error)
//       Alert.alert("Error", "Failed to set wallpaper.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const shareWallpaper = async () => {
//     try {
//       await Share.share({
//         message: `Check out this amazing wallpaper: ${wallpaper.title}`,
//         url: wallpaper.imageUrl,
//       })
//     } catch (error) {
//       console.error("Error sharing wallpaper:", error)
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <Image source={{ uri: wallpaper.imageUrl }} style={styles.wallpaperImage} />

//       <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//         <ArrowLeft size={24} color="white" />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
//         onPress={() => toggleFavorite(wallpaper.id)}
//       >
//         <Heart size={24} color="white" fill={isFavorite ? "#ef4444" : "transparent"} />
//       </TouchableOpacity>

//       <Animated.View entering={FadeIn.duration(800)} style={styles.bottomSheet}>
//         <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
//           <ScrollView style={styles.detailsContainer}>
//             <Text style={styles.title}>{wallpaper.title}</Text>
//             <Text style={styles.category}>{wallpaper.category}</Text>
//             <Text style={styles.description}>{wallpaper.description}</Text>
//             <Text style={styles.downloads}>{wallpaper.downloads} downloads</Text>

//             <View style={styles.actionsContainer}>
//               <TouchableOpacity style={styles.actionButton} onPress={downloadWallpaper} disabled={loading}>
//                 {loading ? (
//                   <ActivityIndicator size="small" color="white" />
//                 ) : (
//                   <>
//                     <Download size={20} color="white" />
//                     <Text style={styles.actionButtonText}>Download</Text>
//                   </>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.actionButton, styles.applyButton]}
//                 onPress={setAsWallpaper}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color="white" />
//                 ) : (
//                   <>
//                     <ImageIcon size={20} color="white" />
//                     <Text style={styles.actionButtonText}>Set as Wallpaper</Text>
//                   </>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.actionButton, styles.shareButton]} onPress={shareWallpaper}>
//                 <Share2 size={20} color="white" />
//                 <Text style={styles.actionButtonText}>Share</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </BlurView>
//       </Animated.View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   wallpaperImage: {
//     width: "100%",
//     height: "100%",
//     position: "absolute",
//   },
//   backButton: {
//     position: "absolute",
//     top: 50,
//     left: 16,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 10,
//   },
//   favoriteButton: {
//     position: "absolute",
//     top: 50,
//     right: 16,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 10,
//   },
//   favoriteButtonActive: {
//     backgroundColor: "rgba(239, 68, 68, 0.3)",
//   },
//   bottomSheet: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     overflow: "hidden",
//   },
//   blurContainer: {
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//   },
//   detailsContainer: {
//     padding: 24,
//     maxHeight: 400,
//   },
//   title: {
//     fontSize: 24,
//     fontFamily: "Poppins-Bold",
//     color: "white",
//   },
//   category: {
//     fontSize: 16,
//     fontFamily: "Poppins-Medium",
//     color: "rgba(255, 255, 255, 0.8)",
//     marginTop: 4,
//   },
//   description: {
//     fontSize: 14,
//     fontFamily: "Poppins-Regular",
//     color: "rgba(255, 255, 255, 0.7)",
//     marginTop: 12,
//     lineHeight: 22,
//   },
//   downloads: {
//     fontSize: 14,
//     fontFamily: "Poppins-Medium",
//     color: "rgba(255, 255, 255, 0.6)",
//     marginTop: 12,
//   },
//   actionsContainer: {
//     marginTop: 24,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   actionButton: {
//     flex: 1,
//     backgroundColor: "#0ea5e9",
//     padding: 12,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 8,
//   },
//   applyButton: {
//     backgroundColor: "#10b981",
//     marginRight: 8,
//   },
//   shareButton: {
//     backgroundColor: "#8b5cf6",
//     marginRight: 0,
//   },
//   actionButtonText: {
//     color: "white",
//     fontFamily: "Poppins-Medium",
//     marginLeft: 8,
//   },
//   notFoundContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f9fafb",
//   },
//   notFoundText: {
//     fontSize: 18,
//     fontFamily: "Poppins-Medium",
//     color: "#1e293b",
//     marginBottom: 16,
//   },
//   backButtonText: {
//     fontSize: 16,
//     fontFamily: "Poppins-Medium",
//     color: "#0ea5e9",
//   },
// })
