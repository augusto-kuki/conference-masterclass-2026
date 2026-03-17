import { Feather } from '@expo/vector-icons'
import React from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import theme from '../../global/styles/theme'
import { styles } from './styles'

interface InputProps extends TextInputProps {
  icon: 'file' | 'lock' | 'mail' | 'user'
}

export default function Input({ icon, onChangeText, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      <Feather
        name={icon}
        size={20}
        color={theme.colors.primary}
        style={styles.icon}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={onChangeText}
        placeholderTextColor={theme.colors.textMuted}
        {...rest}
      />
    </View>
  )
}
