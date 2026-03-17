import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import Loader from '../components/Loader'

interface LoaderContextData {
  loading: boolean
  showLoader(): void
  hideLoader(): void
}

const LoaderContext = createContext<LoaderContextData | null>(null)

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)

  const showLoader = useCallback(() => setLoading(true), [])
  const hideLoader = useCallback(() => setLoading(false), [])

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
      {loading && <Loader />}
    </LoaderContext.Provider>
  )
}

export function useLoader(): LoaderContextData {
  const context = useContext(LoaderContext)
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider')
  }
  return context
}
