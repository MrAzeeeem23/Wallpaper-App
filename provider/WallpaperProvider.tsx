"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ImagePicker from "expo-image-picker"
import { Alert, Platform } from "react-native"
import * as FileSystem from "expo-file-system"

type Wallpaper = {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  downloads: number
  isUserUploaded?: boolean
}

type WallpaperContextType = {
  wallpapers: Wallpaper[]
  favorites: string[]
  downloads: string[]
  loading: boolean
  toggleFavorite: (id: string) => void
  addDownload: (id: string) => void
  refreshWallpapers: () => Promise<void>
  uploadWallpaper: () => Promise<void>
  deleteWallpaper: (id: string) => Promise<void>
}

const WallpaperContext = createContext<WallpaperContextType>({
  wallpapers: [],
  favorites: [],
  downloads: [],
  loading: true,
  toggleFavorite: () => {},
  addDownload: () => {},
  refreshWallpapers: async () => {},
  uploadWallpaper: async () => {},
  deleteWallpaper: async () => {},
})

export const useWallpapers = () => useContext(WallpaperContext)

export const WallpaperProvider = ({ children }) => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [downloads, setDownloads] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [wallpapersData, favoritesData, downloadsData] = await Promise.all([
        AsyncStorage.getItem("wallpapers"),
        AsyncStorage.getItem("favorites"),
        AsyncStorage.getItem("downloads"),
      ])

      if (wallpapersData) {
        setWallpapers(JSON.parse(wallpapersData))
      }

      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData))
      } else {
        await AsyncStorage.setItem("favorites", JSON.stringify([]))
        setFavorites([])
      }

      if (downloadsData) {
        setDownloads(JSON.parse(downloadsData))
      } else {
        await AsyncStorage.setItem("downloads", JSON.stringify([]))
        setDownloads([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshWallpapers = async () => {
    await loadData()
  }

  const toggleFavorite = async (id: string) => {
    try {
      let newFavorites
      if (favorites.includes(id)) {
        newFavorites = favorites.filter((favId) => favId !== id)
      } else {
        newFavorites = [...favorites, id]
      }
      setFavorites(newFavorites)
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const addDownload = async (id: string) => {
    try {
      if (!downloads.includes(id)) {
        const newDownloads = [...downloads, id]
        setDownloads(newDownloads)
        await AsyncStorage.setItem("downloads", JSON.stringify(newDownloads))

        // Update download count in wallpapers
        const updatedWallpapers = wallpapers.map((wallpaper) => {
          if (wallpaper.id === id) {
            return { ...wallpaper, downloads: wallpaper.downloads + 1 }
          }
          return wallpaper
        })
        setWallpapers(updatedWallpapers)
        await AsyncStorage.setItem("wallpapers", JSON.stringify(updatedWallpapers))
      }
    } catch (error) {
      console.error("Error adding download:", error)
    }
  }

  const uploadWallpaper = async () => {
    try {
      // Request permission to access the photo library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant access to your photo library to upload wallpapers.")
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [9, 16],
      })

      if (result.canceled) {
        return
      }

      const selectedAsset = result.assets[0]

      // Create a unique ID for the wallpaper
      const newId = Date.now().toString()

      // If on web, we can use the URI directly
      // On native platforms, we need to handle the file differently
      let imageUri = selectedAsset.uri

      if (Platform.OS !== "web") {
        // For native platforms, we'll copy the file to app's document directory
        // This ensures the file remains accessible even if the original is deleted
        const fileName = imageUri.split("/").pop()
        const newPath = FileSystem.documentDirectory + fileName

        await FileSystem.copyAsync({
          from: imageUri,
          to: newPath,
        })

        imageUri = newPath
      }

      // Create new wallpaper object
      const newWallpaper: Wallpaper = {
        id: newId,
        title: "My Wallpaper",
        category: "Custom",
        description: "User uploaded wallpaper",
        imageUrl: imageUri,
        downloads: 0,
        isUserUploaded: true,
      }

      // Add to wallpapers list
      const updatedWallpapers = [...wallpapers, newWallpaper]
      setWallpapers(updatedWallpapers)
      await AsyncStorage.setItem("wallpapers", JSON.stringify(updatedWallpapers))

      Alert.alert("Success", "Wallpaper uploaded successfully!")
    } catch (error) {
      console.error("Error uploading wallpaper:", error)
      Alert.alert("Error", "Failed to upload wallpaper. Please try again.")
    }
  }

  const deleteWallpaper = async (id: string) => {
    try {
      // Only allow deletion of user-uploaded wallpapers
      const wallpaper = wallpapers.find((w) => w.id === id)

      if (!wallpaper || !wallpaper.isUserUploaded) {
        Alert.alert("Error", "You can only delete wallpapers you've uploaded.")
        return
      }

      // Remove from wallpapers list
      const updatedWallpapers = wallpapers.filter((w) => w.id !== id)
      setWallpapers(updatedWallpapers)
      await AsyncStorage.setItem("wallpapers", JSON.stringify(updatedWallpapers))

      // Also remove from favorites if present
      if (favorites.includes(id)) {
        const updatedFavorites = favorites.filter((favId) => favId !== id)
        setFavorites(updatedFavorites)
        await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      }

      Alert.alert("Success", "Wallpaper deleted successfully!")
    } catch (error) {
      console.error("Error deleting wallpaper:", error)
      Alert.alert("Error", "Failed to delete wallpaper. Please try again.")
    }
  }

  return (
    <WallpaperContext.Provider
      value={{
        wallpapers,
        favorites,
        downloads,
        loading,
        toggleFavorite,
        addDownload,
        refreshWallpapers,
        uploadWallpaper,
        deleteWallpaper,
      }}
    >
      {children}
    </WallpaperContext.Provider>
  )
}
