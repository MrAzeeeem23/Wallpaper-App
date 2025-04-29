import { NavigationContainer } from "@react-navigation/native"
import { ClerkProvider } from "@clerk/clerk-expo"
import { SafeAreaProvider } from "react-native-safe-area-context"
import MainNavigator from "./navigation/mainNavigator"
import { AppwriteProvider } from "./provider/AppwriteProvider"

// Replace with your Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_aGVscGZ1bC1idWNrLTEuY2xlcmsuYWNjb3VudHMuZGV2JA"

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SafeAreaProvider>
        <AppwriteProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </AppwriteProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  )
}
