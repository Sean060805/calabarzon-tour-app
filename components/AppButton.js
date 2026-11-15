import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

// One button style for the whole app, so it looks the same on Android and iPhone.
// variant: 'primary' (green), 'danger' (red), or 'outline' (white with a green border)
export default function AppButton({ title, onPress, variant = 'primary', disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        (pressed || disabled) && styles.faded,
      ]}
    >
      <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  faded: {
    opacity: 0.6,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineText: {
    color: colors.primary,
  },
});
