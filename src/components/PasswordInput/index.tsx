import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { TextInput, TextInputProps, View } from 'react-native'
import theme from '../../global/styles/theme'
import { styles } from './styles'

interface PasswordInputProps extends TextInputProps {
  icon: 'file' | 'lock' | 'mail' | 'user'
}

export default function PasswordInput({
  icon,
  onChangeText,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

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
        secureTextEntry={!showPassword}
        {...rest}
      />
      {showPassword ? (
        <Feather
          name="eye"
          size={20}
          color={theme.colors.primary}
          style={styles.icon}
          onPress={() => setShowPassword(false)}
        />
      ) : (
        <Feather
          name="eye-off"
          size={20}
          color={theme.colors.primary}
          style={styles.icon}
          onPress={() => setShowPassword(true)}
        />
      )}
    </View>
  )
}
