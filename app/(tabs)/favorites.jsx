"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { useWallpapers } from "../../provider/WallpaperProvider"
import Animated, { FadeIn } from "react-native-reanimated"
import { Heart } from "lucide-react-native"
import { BlurView } from "expo-blur"

export default function FavoritesScreen() {
  const { wallpapers, favorites, toggleFavorite } = useWallpapers()
  const [favoriteWallpapers, setFavoriteWallpapers] = useState([])
  const router = useRouter()

  useEffect(() => {
    const favWallpapers = wallpapers.filter((wallpaper) => favorites.includes(wallpaper.id))
    setFavoriteWallpapers(favWallpapers)
  }, [wallpapers, favorites])

  const renderWallpaperItem = ({ item }) => {
    return (
      <Animated.View entering={FadeIn.duration(600)} style={styles.wallpaperContainer}>
        <TouchableOpacity
          style={styles.wallpaperItem}
          onPress={() => router.push(`/wallpaper/${item.id}`)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.wallpaperImage} />
          <BlurView intensity={80} style={styles.wallpaperInfo} tint="dark">
            <Text style={styles.wallpaperTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.wallpaperCategory}>{item.category}</Text>
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)} activeOpacity={0.8}>
          <Heart size={20} color="white" fill="#ef4444" />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your favorite wallpapers collection</Text>
      </View>

      {favoriteWallpapers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={60} color="#e2e8f0" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Add wallpapers to your favorites by tapping the heart icon on any wallpaper
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteWallpapers}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.wallpapersList}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748b",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#1e293b",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#64748b",
    textAlign: "center",
    maxWidth: "80%",
  },
  wallpapersList: {
    padding: 16,
  },
  wallpaperContainer: {
    position: "relative",
    marginBottom: 16,
  },
  wallpaperItem: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  wallpaperImage: {
    width: "100%",
    height: "100%",
  },
  wallpaperInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  wallpaperTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  wallpaperCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
})
