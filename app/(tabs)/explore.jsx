"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Dimensions } from "react-native"
import { useRouter } from "expo-router"
import { useWallpapers } from "../../provider/WallpaperProvider"
import { Search, X } from "lucide-react-native"
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated"
import { BlurView } from "expo-blur"

const { width } = Dimensions.get("window")
const COLUMN_WIDTH = width / 2 - 16

export default function ExploreScreen() {
  const { wallpapers } = useWallpapers()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const router = useRouter()

  const handleSearch = (text) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setSearchResults([])
      return
    }

    const filtered = wallpapers.filter(
      (wallpaper) =>
        wallpaper.title.toLowerCase().includes(text.toLowerCase()) ||
        wallpaper.category.toLowerCase().includes(text.toLowerCase()) ||
        wallpaper.description.toLowerCase().includes(text.toLowerCase()),
    )
    setSearchResults(filtered)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

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
            <Text style={styles.wallpaperTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.wallpaperCategory}>{item.category}</Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const popularCategories = [
    {
      name: "Nature",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
    },
    { name: "Abstract", image: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&auto=format&fit=crop" },
    { name: "Space", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop" },
    { name: "Urban", image: "https://images.unsplash.com/photo-1545843364-9e5b5b8fa511?w=800&auto=format&fit=crop" },
  ]

  const renderCategoryItem = ({ item, index }) => (
    <Animated.View entering={FadeIn.delay(index * 100).duration(800)}>
      <TouchableOpacity style={styles.categoryCard} onPress={() => handleSearch(item.name)} activeOpacity={0.9}>
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
        <BlurView intensity={70} style={styles.categoryOverlay} tint="dark">
          <Text style={styles.categoryName}>{item.name}</Text>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Search for your perfect wallpaper</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search wallpapers..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>

      {searchQuery.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.resultsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No wallpapers found</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <FlatList
            data={popularCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#1e293b",
  },
  clearButton: {
    padding: 8,
  },
  resultsContainer: {
    padding: 8,
    paddingBottom: 20,
  },
  wallpaperItem: {
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    width: COLUMN_WIDTH,
    height: 240,
    position: "relative",
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
  categoriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: "#1e293b",
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 12,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "white",
  },
})
