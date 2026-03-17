import {
  APP_TYPE,
  CONFERENCE_APP_TYPE,
  EVENT_CODE,
  EVENT_TOKEN,
  REGISTER_TOKEN_PARAM,
} from '@/constants'
import { useAuth, useLoader } from '@/hooks'
import { api } from '@/services/api'
import { checkFaceId } from '@/services/checkFaceId'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { type Href, router } from 'expo-router'
import qs from 'qs'
import { useEffect, useRef, useState } from 'react'
import { Alert, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { WebViewNavigation } from 'react-native-webview'
import WebView from 'react-native-webview'
 

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export default function HomeScreen() {
  const [authState, setAuthState] = useState(1)
  const { showLoader, hideLoader } = useLoader()
  const { signOut, user } = useAuth()

  const notificationListenerRef = useRef<Notifications.EventSubscription | null>(null)
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(null)

  useEffect(() => {
    registerForPushNotificationsAsync()

    notificationListenerRef.current =
      Notifications.addNotificationReceivedListener(() => {})

    responseListenerRef.current =
      Notifications.addNotificationResponseReceivedListener(() => {})

    return () => {
      notificationListenerRef.current?.remove()
      responseListenerRef.current?.remove()
    }
  }, [user?.conference_id, user?.document_primary])

  async function registerForPushNotificationsAsync() {
    if (!user) return
    const { conference_id, document_primary } = user

    if (!Device.isDevice) {
      Alert.alert(
        'Você precisa estar em um dispositivo físico para usar as notificações.'
      )
      return
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      return
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId ??
      undefined

    if (!projectId) {
      return
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId })
      const token = tokenData?.data
      if (!token) return

      const body = qs.stringify({
        conference_id,
        document: document_primary,
        push_token: token,
        type_system_cell: Platform.OS,
      })

      await api.post(`/v1/${REGISTER_TOKEN_PARAM.EVENTO}/`, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${EVENT_TOKEN}`,
        },
      })
    } catch {
      // ignore
    }
  }

  const handleWebViewNavigationStateChange = async (
    event: WebViewNavigation
  ) => {
    const url = event?.url ?? ''
    if (!url) return

    if (url.includes('logout-app=sucesso')) {
      signOut()
      hideLoader()
      router.replace('/(auth)/sign-in' as Href)
    } else if (url.includes('nivel_autenticacao_atualizar=2')) {
      await AsyncStorage.setItem('@conference-cepp:nivel_autenticacao', '2')
      setAuthState(2)
    }
  }

  useEffect(() => {
    async function loadAuthState() {
      const stored = await AsyncStorage.getItem('@conference-cepp:nivel_autenticacao')
      if (stored === '1' || stored === '2') {
        setAuthState(Number(stored))
      }
    }
    loadAuthState()
  }, [])

  useEffect(() => {
    if (!user) return
    const verifyFaceId = async () => {
      const hasFaceId = await checkFaceId(user.document, user.conference_id)
      if (!hasFaceId) {
        router.push('/face-register' as Href)
      }
    }
    verifyFaceId()
  }, [user?.document, user?.conference_id])

  if (!user) {
    return null
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <WebView
          source={{
            uri: `https://www.conferencebr.com/${APP_TYPE.APP_WEB}/${EVENT_CODE}/BR/?HASHSOCIO=${user.hash_auth}&ambiente_conference=${CONFERENCE_APP_TYPE.APP}&nivel_autenticacao=${authState}`,
          }}
          useWebKit
          cacheEnabled
          allowsFullscreenVideo
          allowFileAccess
          onLoadStart={showLoader}
          onLoadEnd={hideLoader}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  content: {
    flex: 1,
  },
})