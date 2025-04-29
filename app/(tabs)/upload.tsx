"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useWallpapers } from "../../provider/WallpaperProvider"
import { useTheme } from "../../provider/ThemeProvider"
import { Upload, Image as ImageIcon, X } from "lucide-react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import * as ImagePicker from "expo-image-picker"

export default function UploadScreen() {
  const { uploadWallpaper } = useWallpapers()
  const { colors } = useTheme()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const pickImage = async () => {
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

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image. Please try again.")
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.")
      return
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your wallpaper.")
      return
    }

    try {
      setIsUploading(true)
      await uploadWallpaper()

      // Reset form
      setSelectedImage(null)
      setTitle("")
      setCategory("")
      setDescription("")

      Alert.alert("Success", "Wallpaper uploaded successfully!")
    } catch (error) {
      console.error("Error uploading:", error)
      Alert.alert("Error", "Failed to upload wallpaper. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Upload Wallpaper</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Share your wallpaper with others</Text>
        </View>

        <Animated.View entering={FadeIn.duration(600)} style={styles.uploadContainer}>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.uploadBox, { borderColor: colors.border, backgroundColor: colors.card }]}
              onPress={pickImage}
            >
              <ImageIcon size={48} color={colors.primary} />
              <Text style={[styles.uploadText, { color: colors.text }]}>Select Image</Text>
              <Text style={[styles.uploadSubtext, { color: colors.subtext }]}>
                Tap to choose a wallpaper from your gallery
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.formContainer}>
            <Text style={[styles.formLabel, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.inputText, borderColor: colors.border },
              ]}
              placeholder="Enter wallpaper title"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.formLabel, { color: colors.text }]}>Category</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.input, color: colors.inputText, borderColor: colors.border },
              ]}
              placeholder="Enter category (e.g. Nature, Abstract)"
              placeholderTextColor={colors.subtext}
              value={category}
              onChangeText={setCategory}
            />

            <Text style={[styles.formLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.input, color: colors.inputText, borderColor: colors.border },
              ]}
              placeholder="Enter a description for your wallpaper"
              placeholderTextColor={colors.subtext}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={handleUpload}
              disabled={isUploading || !selectedImage}
            >
              <Upload size={20} color="white" />
              <Text style={styles.uploadButtonText}>{isUploading ? "Uploading..." : "Upload Wallpaper"}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  uploadContainer: {
    width: "100%",
  },
  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginTop: 16,
  },
  uploadSubtext: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
    position: "relative",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  clearButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    marginTop: 10,
  },
  formLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  uploadButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginLeft: 8,
  },
})
