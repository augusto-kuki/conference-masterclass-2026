import Button from '@/components/Button'
import Input from '@/components/Input'
import { EVENT_TOKEN } from '@/constants'
import { useAuth, useLoader } from '@/hooks'
import { api } from '@/services/api'
import { type Href, router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './sign-in.styles'

const logo = require('../../../assets/masterclass.png')
const logoConference = require('../../../assets/conference_logo.png')

export default function SignInScreen() {
  const [login, setLogin] = useState('')
  const { signIn } = useAuth()
  const { showLoader, hideLoader } = useLoader()

  async function handleSignIn() {
    if (!login.trim()) {
      Alert.alert('Preencha os dados para fazer login!')
      return
    }
    showLoader()
    const success = await signIn({ login: login.trim() })
    hideLoader()
    if (success) {
      router.replace('/(app)/(tabs)' as Href)
    }
  }

  async function handleResetPassword() {
    if (!login.trim()) {
      Alert.alert('Preencha o seu CPF!')
      return
    }
    showLoader()
    try {
      const response = await api.get(`/v1/passrecovery/?document=${login}`, {
        headers: { Authorization: `Bearer ${EVENT_TOKEN}` },
      })
      const { error } = response.data as { error?: boolean }
      if (error) {
        Alert.alert(
          'CPF ou senha inválidos. Tente novamente, ou tente recuperar sua senha.'
        )
        return
      }
      Alert.alert('Sua senha foi enviada para seu e-mail de cadastro.')
    } catch {
      Alert.alert(
        'CPF ou senha inválidos. Tente novamente, ou tente recuperar sua senha.'
      )
    } finally {
      hideLoader()
    }
  }

  function navigateToSignUp() {
    Linking.openURL(
      'https://api.whatsapp.com/send/?phone=5511933167946&text=Ol%C3%A1,%20baixei%20o%20aplicativo%207%C2%AA%20Masterclass%20em%20Psiquiatria%20e%20gostaria%20de%20realizar%20minha%20inscri%C3%A7%C3%A3o.'
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.container}>
            <Image source={logo} resizeMode="contain" style={styles.logo} />
            <Text style={styles.title}>Faça seu login</Text>
            <Input
              icon="file"
              onChangeText={setLogin}
              placeholder="CPF"
              autoCorrect={false}
              value={login}
            />
            <Button onPress={handleSignIn}>Entrar</Button>
            <Button variant="secondary" onPress={navigateToSignUp}>
              Inscreva-se aqui!
            </Button>
            {/* <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleResetPassword}
            > */}
              {/* <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text> */}
            {/* </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.poweredBy}>
        <Text style={styles.poweredByText}>powered by</Text>
        <Image
          source={logoConference}
          resizeMode="contain"
          style={styles.conferenceLogo}
        />
      </View>

      <TouchableOpacity
        style={styles.deleteAccountButton}
        onPress={() => Linking.openURL('https://www.conferencebr.com/suporte/')}
      >
        <Text style={styles.deleteAccountText}>Solicitar exclusão de conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
