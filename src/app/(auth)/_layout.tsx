import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
