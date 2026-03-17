import { API_REKOGNITION_URL } from '@/constants'

type RegisterUserParams = {
  imageUri: string
  cpf: string
  conference_id: string
}

export async function registerUser({
  imageUri,
  cpf,
  conference_id,
}: RegisterUserParams): Promise<unknown> {
  const formData = new FormData()
  formData.append('file', {
    uri: imageUri,
    name: 'face.jpg',
    type: 'image/jpeg',
  } as never)

  const params = new URLSearchParams({ cpf, conference_id }).toString()
  const response = await fetch(`${API_REKOGNITION_URL}/register?${params}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      (error as { error?: string }).error || 'Erro ao registrar usuário'
    )
  }
  return response.json()
}
