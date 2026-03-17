import theme from '@/global/styles/theme'
import { useAuth } from '@/hooks'
import { type Href, Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const { user, isReady } = useAuth()

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  if (user) {
    return <Redirect href={"/(app)/(tabs)" as Href} />
  }

  return <Redirect href={"/(auth)/sign-in" as Href} />
}
