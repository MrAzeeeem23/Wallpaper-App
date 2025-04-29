"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo"
import { useRouter } from "expo-router"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"

export default function AuthScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" })
  const { signUp, setActive: setSignUpActive } = useSignUp()
  const { signIn, setActive: setSignInActive } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive({ session: createdSessionId })
        router.replace("/(tabs)")
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
          router.replace("/(tabs)")
        }
      } else {
        // Sign up
        const { createdSessionId } = await signUp.create({
          emailAddress: email,
          password,
        })

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

        if (createdSessionId) {
          await setSignUpActive({ session: createdSessionId })
          router.replace("/(tabs)")
        }
      }
    } catch (err) {
      console.error("Auth error", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="light" />
      <LinearGradient colors={["#0ea5e9", "#3b82f6"]} style={styles.container}>
        <Animated.View entering={FadeInUp.duration(1000).delay(200)} style={styles.logoContainer}>
          <Image source={{ uri: "/placeholder.svg?height=120&width=120" }} style={styles.logo} />
          <Text style={styles.title}>WallHub</Text>
          <Text style={styles.subtitle}>Stunning wallpapers for your device</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1000).delay(400)} style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onEmailSubmit} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  input: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#0ea5e9",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#94a3b8",
    fontFamily: "Poppins-Medium",
  },
  googleButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: "#334155",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  switchButton: {
    alignItems: "center",
    marginTop: 10,
  },
  switchText: {
    color: "#0ea5e9",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
})
