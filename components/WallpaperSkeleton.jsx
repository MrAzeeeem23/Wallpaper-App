import { View, StyleSheet, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated"

const { width } = Dimensions.get("window")
const COLUMN_WIDTH = width / 2 - 16

export function WallpaperSkeleton() {
  const opacity = useSharedValue(0.3)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  })

  // Start the animation
  opacity.value = withRepeat(withTiming(0.6, { duration: 1000 }), -1, true)

  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, index) => (
        <Animated.View key={index} style={[styles.skeletonItem, animatedStyle]}>
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonInfo}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonCategory} />
          </View>
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  skeletonItem: {
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    width: COLUMN_WIDTH,
    height: 240,
    backgroundColor: "#e2e8f0",
  },
  skeletonImage: {
    width: "100%",
    height: "80%",
    backgroundColor: "#e2e8f0",
  },
  skeletonInfo: {
    padding: 12,
    backgroundColor: "#f1f5f9",
  },
  skeletonTitle: {
    width: "70%",
    height: 14,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonCategory: {
    width: "40%",
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
  },
})
