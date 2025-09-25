
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, buttonStyles } from '../styles/commonStyles';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
}

export default function Button({ 
  text, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return buttonStyles.secondary;
      case 'outline':
        return buttonStyles.outline;
      default:
        return buttonStyles.primary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        getButtonStyle(),
        style,
        disabled && styles.disabled
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), textStyle, disabled && styles.disabledText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
