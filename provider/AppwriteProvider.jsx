"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Client, Account, Databases, Storage, ID } from "appwrite"
import { useUser } from "@clerk/clerk-expo"

// Constants for Appwrite
const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1"
const APPWRITE_PROJECT_ID = "6810a0d30003dcb25c88"
const STORAGE_BUCKET_ID = "681109a5002acf5e3c2d" // Add your bucket ID here
const WALLPAPERS_DATABASE_ID = "6810a362000e5bb158de" // Add your database ID here
const WALLPAPERS_COLLECTION_ID = "6810a38b0026f9d9c28e" // Add your collection ID here

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Create context
const AppwriteContext = createContext({
  appwrite: { client, account, databases, storage },
  isAuthenticated: false,
  uploadImage: async (file, onProgress) => "",
  createWallpaperDocument: async (data) => ({}),
  constants: {
    STORAGE_BUCKET_ID,
    WALLPAPERS_DATABASE_ID,
    WALLPAPERS_COLLECTION_ID
  }
})

export const useAppwrite = () => useContext(AppwriteContext)

export const AppwriteProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    const setupAppwriteSession = async () => {
      if (isSignedIn && user) {
        try {
          // Create a JWT for Appwrite from Clerk user
          // This is a simplified example - you would need a server endpoint to create a proper JWT
          // that Appwrite can validate

          // For a real implementation, you would:
          // 1. Call your backend API with the Clerk session token
          // 2. Your backend would verify the Clerk token and create an Appwrite JWT
          // 3. Return that JWT to the client
          // 4. Use that JWT to create an Appwrite session

          // For demo purposes, we're just setting the authenticated state
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Error setting up Appwrite session:", error)
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
    }

    setupAppwriteSession()
  }, [isSignedIn, user])

  /**
   * Upload an image file to Appwrite Storage
   * @param {File|Blob} file - The file to upload
   * @param {Function} onProgress - Optional callback for upload progress
   * @returns {Promise<string>} - The file ID of the uploaded file
   */
  const uploadImage = async (file, onProgress) => {
    try {
      // Create a file from the image URI
      // For React Native/Expo, you would need to convert the URI to a file/blob
      const fileId = ID.unique()
      
      // Upload the file to Appwrite Storage
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        fileId,
        file,
        undefined, // permissions
        onProgress  // optional progress callback
      )
      
      return fileId
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  /**
   * Create a new wallpaper document in the database
   * @param {Object} data - Wallpaper data (title, category, description, imageId, etc.)
   * @returns {Promise<Object>} - The created document
   */
  const createWallpaperDocument = async (data) => {
    try {
      // Create a document in the wallpapers collection
      const wallpaper = await databases.createDocument(
        WALLPAPERS_DATABASE_ID,
        WALLPAPERS_COLLECTION_ID,
        ID.unique(),
        {
          title: data.title,
          category: data.category,
          description: data.description,
          imageId: data.imageId,
          userId: user?.id || "anonymous",
          userName: user?.fullName || "Anonymous",
          createdAt: new Date().toISOString(),
          downloads: 0,
          likes: 0,
        }
      )
      
      return wallpaper
    } catch (error) {
      console.error("Error creating wallpaper document:", error)
      throw error
    }
  }

  return (
    <AppwriteContext.Provider 
      value={{ 
        appwrite: { client, account, databases, storage }, 
        isAuthenticated, 
        uploadImage,
        createWallpaperDocument,
        constants: {
          STORAGE_BUCKET_ID,
          WALLPAPERS_DATABASE_ID,
          WALLPAPERS_COLLECTION_ID
        }
      }}
    >
      {children}
    </AppwriteContext.Provider>
  )
}