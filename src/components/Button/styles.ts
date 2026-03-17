import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import theme from '../../global/styles/theme'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: RFValue(38),
    borderRadius: 10,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPrimary: {
    backgroundColor: theme.colors.primary,
  },
  containerSecondary: {
    backgroundColor: theme.colors.surface,
  },
  buttonText: {
    fontSize: RFValue(14),
  },
  buttonTextPrimary: {
    color: theme.colors.onPrimary,
    fontWeight: '400',
  },
  buttonTextSecondary: {
    color: theme.colors.secondary,
    fontWeight: '600',
  },
})
