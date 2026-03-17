 
import { EVENT_TOKEN } from '@/constants'

export async function uploadProfilePhoto(
  imageUrl: string,
  imageType: string,
  userHash: string
): Promise<unknown> {
  const formData = new FormData()
  formData.append('photo_socio', {
    uri: imageUrl,
    type: imageType,
    name: 'photo_socio',
  } as never)

  const url = `https://api.conferencebr.com/v1/savephotoprofile/?hash_socio=${userHash}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${EVENT_TOKEN}`,
    },
    body: formData,
  })

  return response.json()
}
