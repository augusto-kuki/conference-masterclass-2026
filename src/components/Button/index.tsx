import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { styles } from './styles'

interface ButtonProps extends TouchableOpacityProps {
  children: string
  variant?: 'primary' | 'secondary'
}

export default function Button({
  children,
  variant = 'primary',
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        variant === 'secondary'
          ? styles.containerSecondary
          : styles.containerPrimary,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'secondary'
            ? styles.buttonTextSecondary
            : styles.buttonTextPrimary,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}
