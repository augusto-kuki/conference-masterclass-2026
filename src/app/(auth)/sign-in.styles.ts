import theme from '@/global/styles/theme'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  keyboardView: { 
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: RFValue(14),
    color: theme.colors.primary,
    marginVertical: 30,
    marginHorizontal: 0,
  },
  logo: {
    width: '100%',
    height: RFValue(100),
  },
  forgotPassword: {
    marginTop: 24,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: RFValue(12),
  },
  poweredBy: {
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 16,
    backgroundColor: theme.colors.surface,
  },
  poweredByText: {
    color: theme.colors.text,
    fontSize: RFValue(12),
  },
  conferenceLogo: {
    width: '100%',
    height: RFValue(50),
  },
})


export default styles