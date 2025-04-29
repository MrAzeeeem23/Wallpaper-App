"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native"
import { useRoute } from "@react-navigation/native"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"
// import * as Wallpaper from "expo-wallpaper"
import { Download, Image as ImageIcon } from "lucide-react-native"

export default function WallpaperDetailScreen() {
  const route = useRoute()
  const { wallpaper } = route.params
  const [loading, setLoading] = useState(false)

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
        if (Platform.OS === "android") {
          // On Android, we can set the wallpaper directly
          await Wallpaper.setWallpaperAsync(downloadResult.uri)
          Alert.alert("Success", "Wallpaper applied successfully!")
        } else {
          // On iOS, we need to save it to the gallery and guide the user
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri)
          Alert.alert(
            "Wallpaper Saved",
            "The wallpaper has been saved to your gallery. Please go to Settings > Wallpaper to set it as your wallpaper.",
            [{ text: "OK" }],
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

  return (
    <View style={styles.container}>
      <Image source={{ uri: wallpaper.imageUrl }} style={styles.wallpaperImage} resizeMode="cover" />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{wallpaper.title}</Text>
        <Text style={styles.category}>{wallpaper.category}</Text>
        <Text style={styles.description}>{wallpaper.description}</Text>
      </View>

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

        <TouchableOpacity style={[styles.actionButton, styles.applyButton]} onPress={setAsWallpaper} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <ImageIcon size={20} color="white" />
              <Text style={styles.actionButtonText}>Set as Wallpaper</Text>
            </>
          )}
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
  wallpaperImage: {
    width: "100%",
    height: "70%",
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  category: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#0ea5e9",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: "#10b981",
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
})
