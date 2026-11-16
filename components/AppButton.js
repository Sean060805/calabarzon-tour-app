import { StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';
import PressableScale from './PressableScale';

// One button style for the whole app, so it looks the same on Android and iPhone.
// variant: 'primary' (green), 'danger' (red), or 'outline' (white with a green border)
// small: a shorter button with smaller text, for rows of less important buttons
export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  small = false,
}) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, small && styles.small, styles[variant], disabled && styles.faded]}
    >
      <Text
        style={[
          styles.text,
          small && styles.smallText,
          variant === 'outline' && styles.outlineText,
        ]}
      >
        {title}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  small: {
    paddingVertical: 9,
    paddingHorizontal: 10,
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
  smallText: {
    fontSize: 14,
  },
  outlineText: {
    color: colors.primary,
  },
});
