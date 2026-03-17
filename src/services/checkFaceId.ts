import { API_REKOGNITION_URL } from "@/constants"


export async function checkFaceId(
  cpf: string,
  conference_id: string
): Promise<boolean> {
  const response = await fetch(
    `${API_REKOGNITION_URL}/has-faceid?cpf=${cpf}&conference_id=${conference_id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  const data = await response.json()
  return data.hasFaceId ?? false
}
