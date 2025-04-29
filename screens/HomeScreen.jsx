"use client"

import { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAppwrite } from "../provider/AppwriteProvider"

export default function HomeScreen() {
  const [wallpapers, setWallpapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()
  const { appwrite } = useAppwrite()

  const fetchWallpapers = async () => {
    try {
      setLoading(true)
      // Replace with your actual database and collection IDs
      const response = await appwrite.databases.listDocuments("your_database_id", "your_wallpapers_collection_id")
      setWallpapers(response.documents)
    } catch (error) {
      console.error("Error fetching wallpapers:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWallpapers()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWallpapers()
  }

  const renderWallpaperItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.wallpaperItem}
        onPress={() => navigation.navigate("WallpaperDetail", { wallpaper: item })}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.wallpaperImage} resizeMode="cover" />
        <View style={styles.wallpaperInfo}>
          <Text style={styles.wallpaperTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.wallpaperCategory} numberOfLines={1}>
            {item.category}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wallpapers}
        renderItem={renderWallpaperItem}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No wallpapers found</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 8,
  },
  wallpaperItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  wallpaperImage: {
    width: "100%",
    height: 200,
  },
  wallpaperInfo: {
    padding: 10,
  },
  wallpaperTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  wallpaperCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
  },
})
