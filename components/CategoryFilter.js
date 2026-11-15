import { ScrollView, StyleSheet } from 'react-native';
import Chip from './Chip';

// A sideways-scrolling row of chips: "All" plus one chip per option.
// The list screen uses it twice: once for categories, once for provinces.
export default function CategoryFilter({ options, selected, onSelect }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={styles.row}
      contentContainerStyle={styles.content}
    >
      {['All', ...options].map((option) => (
        <Chip
          key={option}
          label={option}
          selected={selected === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 0,
  },
  content: {
    paddingHorizontal: 16,
  },
});
