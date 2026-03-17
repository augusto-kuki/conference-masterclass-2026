import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import theme from '../../global/styles/theme'

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: RFValue(38),
    paddingLeft: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  textInput: {
    flex: 1,
    color: theme.colors.textMuted,
    fontSize: RFValue(12),
  },
  icon: {
    marginRight: 16,
  },
})
