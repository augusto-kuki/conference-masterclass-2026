import theme from '@/global/styles/theme'
import { useAuth } from '@/hooks'
import { registerUser } from '@/services/registerUser'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FaceRegisterScreen() {
  const { user } = useAuth()
  const cpf = user?.document_primary
  const conferenceId = user?.conference_id

  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à câmera para continuar.'
      )
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      cameraType: ImagePicker.CameraType.front,
    })
    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri)
    }
  }

  const retakePicture = () => {
    setImage(null)
  }

  const handleSend = async () => {
    if (!image || !cpf || !conferenceId) {
      Alert.alert('Atenção', 'Capture uma foto para continuar.')
      return
    }

    setLoading(true)
    try {
      await registerUser({
        imageUri: image,
        cpf,
        conference_id: conferenceId,
      })

      await AsyncStorage.setItem('face_registered', 'true')

      Alert.alert(
        'Sucesso!',
        'Seu cadastro facial foi realizado com sucesso. Você será redirecionado para a tela inicial.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      )
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Não foi possível registrar o usuário.'
      const isFaceError =
        message.toLowerCase().includes('rosto') ||
        message.toLowerCase().includes('face') ||
        message.toLowerCase().includes('detect')

      if (isFaceError) {
        Alert.alert(
          'Rosto não detectado',
          'Não foi possível detectar um rosto na imagem. Siga as instruções abaixo e tire uma nova foto.',
          [
            {
              text: 'Tirar nova foto',
              onPress: retakePicture,
            },
          ]
        )
      } else {
        Alert.alert('Erro', message, [
          { text: 'Tirar nova foto', onPress: retakePicture },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, image ? styles.headerSmall : undefined]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={[styles.title, image ? styles.titleSmall : undefined]}>
          Cadastro de reconhecimento facial
        </Text>
      </View>

      {!image ? (
        <View style={styles.cameraSection}>
          <View style={styles.cameraCard}>
            <View style={styles.cameraIconContainer}>
              <View style={styles.cameraIconBackground}>
                <Feather name="user" size={40} color={theme.colors.primary} />
              </View>
            </View>
            <Text style={styles.captureTitle}>Vamos começar!</Text>
            <Text style={styles.captureDescription}>
              Tire uma selfie para habilitar o check-in automático no evento
            </Text>

            <TouchableOpacity
              style={[styles.modernCaptureButton, loading && styles.disabledButton]}
              onPress={pickImage}
              disabled={loading}
            >
              <Feather name="camera" size={20} color={theme.colors.onPrimary} />
              <Text style={styles.modernCaptureText}>Abrir Câmera</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.modernPreviewSection}>
          <View style={styles.modernPreviewCard}>
            <View style={styles.previewHeader}>
              <Feather name="image" size={20} color={theme.colors.primary} />
              <Text style={styles.modernPreviewTitle}>Revisar foto</Text>
            </View>

            <Text style={styles.modernPreviewSubtitle}>
              Confira se a foto ficou boa antes de enviar
            </Text>

            <View style={styles.modernImageFrame}>
              <Image source={{ uri: image }} style={styles.modernPreviewImage} />
            </View>

            <View style={styles.modernPreviewActions}>
              <TouchableOpacity
                style={[
                  styles.modernRetakeButton,
                  loading && styles.disabledButton,
                ]}
                onPress={retakePicture}
                disabled={loading}
              >
                <Feather
                  name="rotate-ccw"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.modernRetakeText,
                    loading && styles.disabledText,
                  ]}
                >
                  Refazer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modernConfirmButton,
                  loading && styles.modernConfirmButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.modernConfirmText}>Enviando...</Text>
                ) : (
                  <>
                    <Feather
                      name="send"
                      size={16}
                      color={theme.colors.onPrimary}
                    />
                    <Text style={styles.modernConfirmText}>
                      Finalizar Cadastro
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {!image && (
        <View style={styles.modernInstructionsContainer}>
          <Text style={styles.modernInstructionsTitle}>
            Dicas para uma foto perfeita
          </Text>
          <View style={styles.tipsGrid}>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="eye" size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.tipText}>Olhos abertos</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="sun" size={16} color={theme.colors.success} />
              </View>
              <Text style={styles.tipText}>Boa luz</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="user" size={16} color={theme.colors.primary} />
              </View>
              <Text style={styles.tipText}>Só você</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather
                  name="alert-triangle"
                  size={16}
                  color={theme.colors.error}
                />
              </View>
              <Text style={styles.tipText}>Sem acessórios</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: theme.colors.primary,
  },
  headerSmall: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  titleSmall: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  backButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    marginLeft: 6,
  },
  cameraSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cameraCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cameraIconContainer: {
    marginBottom: 20,
  },
  cameraIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryBorder,
  },
  captureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    marginBottom: 8,
    textAlign: 'center',
  },
  captureDescription: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  modernCaptureButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  modernCaptureText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modernPreviewSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modernPreviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  modernPreviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    marginLeft: 8,
  },
  modernPreviewSubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  modernImageFrame: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  modernPreviewImage: {
    width: 200,
    height: 250,
  },
  modernPreviewActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  modernRetakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  modernRetakeText: {
    color: theme.colors.primary,
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modernConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  modernConfirmButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  modernConfirmText: {
    color: theme.colors.onPrimary,
    marginLeft: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modernInstructionsContainer: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  modernInstructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    marginBottom: 15,
    textAlign: 'center',
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tipItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 15,
    backgroundColor: theme.colors.primaryMutedLight,
    borderRadius: 12,
    padding: 12,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.textMuted,
  },
})
