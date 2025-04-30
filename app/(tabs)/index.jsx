"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, RefreshControl, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useWallpapers } from "../../provider/WallpaperProvider"
import Animated, { FadeInDown } from "react-native-reanimated"
import { BlurView } from "expo-blur"
import { Download } from "lucide-react-native"
import { WallpaperSkeleton } from "../../components/WallpaperSkeleton"

const { width } = Dimensions.get("window")
const COLUMN_WIDTH = width / 2 - 16

export default function HomeScreen() {
  const { wallpapers, loading, refreshWallpapers } = useWallpapers()
  const [refreshing, setRefreshing] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  useEffect(() => {
    if (wallpapers.length > 0) {
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(wallpapers.map((item) => item.category))]
      setCategories(uniqueCategories)
    }
  }, [wallpapers])

  const onRefresh = async () => {
    setRefreshing(true)
    await refreshWallpapers()
    setRefreshing(false)
  }

  const filteredWallpapers =
    selectedCategory === "All" ? wallpapers : wallpapers.filter((wallpaper) => wallpaper.category === selectedCategory)

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item && styles.categoryItemSelected]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextSelected]}>{item}</Text>
    </TouchableOpacity>
  )

  const renderWallpaperItem = ({ item, index }) => {
    return (
      <Animated.View entering={FadeInDown.delay(index * 100).duration(600)}>
        <TouchableOpacity
          style={styles.wallpaperItem}
          onPress={() => router.push(`/wallpaper/${item.id}`)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.wallpaperImage} />
          <BlurView intensity={80} style={styles.wallpaperInfo} tint="dark">
            <View>
              <Text style={styles.wallpaperTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.wallpaperCategory}>{item.category}</Text>
            </View>
            <View style={styles.downloadInfo}>
              <Download size={12} color="white" />
              <Text style={styles.downloadCount}>{item.downloads}</Text>
            </View>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Discover</Text>
        <Text style={styles.subtitle}>Find the perfect wallpaper for your screen</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {loading && !refreshing ? (
        <WallpaperSkeleton />
      ) : (
        <FlatList
          data={filteredWallpapers}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.wallpapersList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No wallpapers found</Text>
            </View>
          }
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
  greeting: {
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
  categoriesContainer: {
    marginVertical: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f1f5f9",
  },
  categoryItemSelected: {
    backgroundColor: "#0ea5e9",
  },
  categoryText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#64748b",
  },
  categoryTextSelected: {
    color: "white",
  },
  wallpapersList: {
    padding: 0,
    paddingBottom: 20,
  },
  wallpaperItem: {
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    width: COLUMN_WIDTH,
    height: 240,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wallpaperTitle: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  wallpaperCategory: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  downloadInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  downloadCount: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "white",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#64748b",
  },
})
