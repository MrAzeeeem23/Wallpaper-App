"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Client, Account, Databases, Storage } from "appwrite"
import { useUser } from "@clerk/clerk-expo"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject("your_appwrite_project_id") // Replace with your project ID

const account = new Account(client)
const databases = new Databases(client)
const storage = new Storage(client)

// Create context
const AppwriteContext = createContext({
  appwrite: { client, account, databases, storage },
  isAuthenticated: false,
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

  return (
    <AppwriteContext.Provider value={{ appwrite: { client, account, databases, storage }, isAuthenticated }}>
      {children}
    </AppwriteContext.Provider>
  )
}
