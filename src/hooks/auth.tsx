import { EVENT_TOKEN } from '@/constants'
import { api } from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Alert } from 'react-native'
import { AuthContextData, SignInCredentials, User } from '../../types'

const AuthContext = createContext<AuthContextData | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      try {
        const stored = await AsyncStorage.getItem('@conference-cepp:user')
        if (stored) {
          setUser(JSON.parse(stored))
        }
      } finally {
        setIsReady(true)
      }
    }
    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ login }: SignInCredentials): Promise<boolean> => {
    const response = await api.get(`/v1/?menu=authregister&document=${login}`, {
      headers: {
        Authorization: `Bearer ${EVENT_TOKEN}`,
      },
    })

    const { account, error } = response.data as {
      account?: User
      error?: boolean
    }

    if (error) {
      Alert.alert(
        'CPF ou senha inválidos. Tente novamente, ou tente recuperar sua senha.'
      )
      return false
    }

    if (!account) {
      Alert.alert('Resposta inválida do servidor.')
      return false
    }

    await AsyncStorage.setItem(
      '@conference-cepp:user',
      JSON.stringify({ ...account })
    )
    setUser({ ...account })
    return true
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem('@conference-cepp:user')
    await AsyncStorage.setItem('@conference-cepp:nivel_autenticacao', '1')
    setUser(null)
  }, [])

  const updateUser = useCallback(async (updated: User) => {
    await AsyncStorage.setItem(
      '@conference-cepp:user',
      JSON.stringify(updated)
    )
    setUser(updated)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
