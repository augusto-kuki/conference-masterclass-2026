export interface User {
  badge_name: string
  conference_id: string
  document_primary: string
  email: string
  full_name: string
  hash_auth: string
  url_profile: string
  document: string
}

export interface SignInCredentials {
  login: string
}

export interface AuthState {
  user: User | null
}

export interface AuthContextData {
  user: User | null
  isReady: boolean
  signIn(credentials: SignInCredentials): Promise<boolean>
  signOut(): void
  updateUser(user: User): Promise<void>
}
