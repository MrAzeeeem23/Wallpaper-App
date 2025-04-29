"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Wallpaper = {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  downloads: number
}

type WallpaperContextType = {
  wallpapers: Wallpaper[]
  favorites: string[]
  downloads: string[]
  loading: boolean
  toggleFavorite: (id: string) => void
  addDownload: (id: string) => void
  refreshWallpapers: () => Promise<void>
}

const WallpaperContext = createContext<WallpaperContextType>({
  wallpapers: [],
  favorites: [],
  downloads: [],
  loading: true,
  toggleFavorite: () => {},
  addDownload: () => {},
  refreshWallpapers: async () => {},
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
      }}
    >
      {children}
    </WallpaperContext.Provider>
  )
}
