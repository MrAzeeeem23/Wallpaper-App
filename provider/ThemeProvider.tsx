"use client"

import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useColorScheme } from "react-native"

type ThemeType = "light" | "dark" | "system"

interface ThemeContextType {
  theme: ThemeType
  isDark: boolean
  colors: typeof lightColors
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

// Light theme colors
export const lightColors = {
  background: "#f9fafb",
  card: "#ffffff",
  text: "#1e293b",
  subtext: "#64748b",
  border: "#e2e8f0",
  primary: "#0ea5e9",
  secondary: "#10b981",
  accent: "#8b5cf6",
  danger: "#ef4444",
  input: "#f1f5f9",
  inputText: "#1e293b",
  statusBar: "dark",
}

// Dark theme colors
export const darkColors = {
  background: "#0f172a",
  card: "#1e293b",
  text: "#f1f5f9",
  subtext: "#94a3b8",
  border: "#334155",
  primary: "#0ea5e9",
  secondary: "#10b981",
  accent: "#8b5cf6",
  danger: "#ef4444",
  input: "#1e293b",
  inputText: "#f1f5f9",
  statusBar: "light",
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  isDark: false,
  colors: lightColors,
  setTheme: () => {},
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setThemeState] = useState<ThemeType>("system")

  // Determine if dark mode is active based on theme setting and system preference
  const isDark = theme === "system" ? systemColorScheme === "dark" : theme === "dark"

  // Get the appropriate colors based on the active theme
  const colors = isDark ? darkColors : lightColors

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme")
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType)
        }
      } catch (error) {
        console.error("Error loading theme:", error)
      }
    }

    loadTheme()
  }, [])

  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem("theme", newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  )
}
