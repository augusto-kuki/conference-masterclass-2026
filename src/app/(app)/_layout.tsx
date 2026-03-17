import theme from '@/global/styles/theme'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'

export default function AppLayout() {
  return (
    <>
      <StatusBar
        style="auto"
        {...(Platform.OS === 'android' && {
          backgroundColor: theme.colors.primary,
        })}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}
