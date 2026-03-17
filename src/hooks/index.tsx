import { AuthProvider } from './auth'
import { LoaderProvider } from './loader'

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoaderProvider>
  )
}

export { useAuth } from './auth'
export { useLoader } from './loader'
