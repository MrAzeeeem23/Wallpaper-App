"use client"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo"
import { TextInput } from "react-native-gesture-handler"
import { useState } from "react"

export default function AuthScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" })
  const { signUp, setActive } = useSignUp()
  const { signIn, setActive: setSignInActive } = useSignIn()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive: setOAuthActive } = await startOAuthFlow()

      if (createdSessionId) {
        setOAuthActive({ session: createdSessionId })
      }
    } catch (err) {
      console.error("OAuth error", err)
    }
  }

  const onEmailSubmit = async () => {
    setIsLoading(true)
    try {
      if (isLogin) {
        // Sign in
        const { createdSessionId } = await signIn.create({
          identifier: email,
          password,
        })
        if (createdSessionId) {
          await setSignInActive({ session: createdSessionId })
        }
      } else {
        // Sign up
        const { createdSessionId } = await signUp.create({
          emailAddress: email,
          password,
        })

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

        if (createdSessionId) {
          await setActive({ session: createdSessionId })
        }
      }
    } catch (err) {
      console.error("Auth error", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: "/placeholder.svg?height=100&width=100" }} style={styles.logo} />
        <Text style={styles.title}>Wallpaper App</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={onEmailSubmit} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  formContainer: {
    width: "100%",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0ea5e9",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  googleButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchButton: {
    alignItems: "center",
    marginTop: 10,
  },
  switchText: {
    color: "#0ea5e9",
    fontSize: 14,
  },
})
