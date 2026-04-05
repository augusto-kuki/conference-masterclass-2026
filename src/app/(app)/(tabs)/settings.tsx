import theme from '@/global/styles/theme'
import { useAuth } from '@/hooks'
import { uploadProfilePhoto } from '@/services/uploadProfilePhoto'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { type Href, router, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  const [image, setImage] = useState<string | undefined>(undefined)
  const [faceRegistered, setFaceRegistered] = useState<boolean | null>(null)

  const { user } = useAuth()

  function showOptionsAlert() {
    Alert.alert(
      'Escolha uma opção',
      'Escolha uma das opções abaixo para alterar sua foto de perfil',
      [
        { text: 'Tirar foto', onPress: () => openUserCamera() },
        { text: 'Escolher da galeria', onPress: () => openUserPhotoLibrary() },
        { text: 'Cancelar', style: 'cancel' },
      ],
      { cancelable: true }
    )
  }

  async function openUserCamera() {
    if (!user) return
    let cameraPermission = await ImagePicker.getCameraPermissionsAsync()
    if (!cameraPermission.granted) {
      cameraPermission = await ImagePicker.requestCameraPermissionsAsync()
      if (!cameraPermission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Você precisa permitir o acesso à câmera para tirar fotos'
        )
        return
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      cameraType: ImagePicker.CameraType.front,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      await uploadProfilePhoto(
        result.assets[0].uri,
        result.assets[0].mimeType ?? 'image/jpeg',
        user.hash_auth
      )
    }
  }

  async function openUserPhotoLibrary() {
    if (!user) return
    let libraryPermission = await ImagePicker.getMediaLibraryPermissionsAsync()
    if (!libraryPermission.granted) {
      libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!libraryPermission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Você precisa permitir o acesso à galeria para escolher fotos'
        )
        return
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      await uploadProfilePhoto(
        result.assets[0].uri,
        result.assets[0].mimeType ?? 'image/jpeg',
        user.hash_auth
      )
    }
  }

  async function checkFaceRegistration() {
    try {
      const isRegistered = await AsyncStorage.getItem('face_registered')
      setFaceRegistered(isRegistered === 'true')
    } catch {
      setFaceRegistered(false)
    }
  }

  useEffect(() => {
    checkFaceRegistration()
  }, [])

  useFocusEffect(
    useCallback(() => {
      checkFaceRegistration()
    }, [])
  )

  function handleFaceRegister() {
    router.push('/face-register' as Href)
  }

  if (!user) {
    return null
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.profile}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {image ?? user.url_profile ? (
              <Image
                source={{ uri: image ?? user.url_profile }}
                style={styles.avatarImage}
              />
            ) : (
              <Feather name="user" size={64} color={theme.colors.onPrimary} />
            )}
          </View>
          <TouchableOpacity
            style={styles.changeProfileImageButton}
            onPress={showOptionsAlert}
          >
            <Feather name="camera" size={24} color={theme.colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user.full_name}</Text>
      </View>

      <View>
        <TouchableOpacity style={styles.button} onPress={showOptionsAlert}>
          <Feather name="camera" size={24} color={theme.colors.primary} />
          <Text style={styles.buttonText}>Alterar foto</Text>
        </TouchableOpacity>

        <View style={styles.faceRegistrationSection}>
          <View style={styles.statusContainer}>
            <Feather
              name={faceRegistered ? 'check-circle' : 'alert-circle'}
              size={16}
              color={
                faceRegistered ? theme.colors.success : theme.colors.error
              }
            />
            <Text
              style={[
                styles.statusText,
                faceRegistered ? styles.statusSuccess : styles.statusWarning,
              ]}
            >
              {faceRegistered
                ? 'Check-in facial ativo'
                : 'Check-in facial pendente'}
            </Text>
          </View>
          {!faceRegistered && (
            <TouchableOpacity
              style={styles.faceRegisterButton}
              onPress={handleFaceRegister}
            >
              <Feather name="user-plus" size={16} color={theme.colors.onPrimary} />
              <Text style={styles.faceRegisterButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          )}
        </View>
        {faceRegistered && (
          <TouchableOpacity
            style={styles.redoFaceRegisterButton}
            onPress={handleFaceRegister}
          >
            <Text style={styles.redoFaceRegisterText}>
              Refazer cadastro facial
            </Text>
          </TouchableOpacity>
        )}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 32,
    backgroundColor: theme.colors.primary,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 64,
  },
  avatarContainer: {},
  avatar: {
    width: RFValue(120),
    height: RFValue(120),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.textMuted,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
  },
  avatarImage: {
    width: RFValue(120),
    height: RFValue(120),
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
    borderRadius: 9999,
  },
  changeProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: theme.colors.warning,
    height: RFValue(36),
    width: RFValue(36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: theme.colors.onPrimary,
  },
  userName: {
    color: theme.colors.onPrimary,
    fontSize: RFValue(18),
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 140,
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: RFValue(14),
  },
  faceRegistrationSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    minWidth: 280,
    maxWidth: '90%',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: RFValue(12),
    marginLeft: 6,
  },
  statusSuccess: {
    color: theme.colors.success,
  },
  statusWarning: {
    color: theme.colors.error,
  },
  faceRegisterButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  faceRegisterButtonText: {
    color: theme.colors.onPrimary,
    fontSize: RFValue(11),
    marginLeft: 4,
  },
  redoFaceRegisterButton: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
  },
  redoFaceRegisterText: {
    color: theme.colors.textMuted,
    fontSize: RFValue(10),
    textDecorationLine: 'underline',
  },
  deleteAccountButton: {
    position: 'absolute',
    bottom: 48,
    alignSelf: 'center',
    padding: 12,
  },
  deleteAccountText: {
    color: theme.colors.textMuted,
    fontSize: RFValue(12),
    textDecorationLine: 'underline',
  },
})
