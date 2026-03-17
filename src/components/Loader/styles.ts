import { StyleSheet } from 'react-native'
import theme from '../../global/styles/theme'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: 20,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: theme.colors.surfaceSubdued,
  },
})
