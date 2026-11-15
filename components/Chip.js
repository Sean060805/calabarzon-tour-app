import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

// A small rounded button that can be selected, like a radio button
export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable style={[styles.chip, selected && styles.chipSelected]} onPress={onPress}>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontSize: 14,
    color: colors.text,
  },
  labelSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
});
