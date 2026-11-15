import { StyleSheet, TextInput } from 'react-native';
import colors from '../constants/colors';

export default function SearchBar({ value, onChangeText }) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Search by name..."
      placeholderTextColor={colors.textLight}
      autoCorrect={false}
      clearButtonMode="while-editing"
      returnKeyType="search"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 16,
    marginBottom: 12,
  },
});
