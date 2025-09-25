
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, spacing, commonStyles } from '../styles/commonStyles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
}

export default function Input({ 
  label, 
  error, 
  containerStyle, 
  style,
  onFocus,
  onBlur,
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          commonStyles.input,
          isFocused && commonStyles.inputFocused,
          error && commonStyles.inputError,
          style,
        ]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={commonStyles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
