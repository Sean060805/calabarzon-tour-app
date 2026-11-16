import { StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

// A bar that fills from left to right. percent is a number from 0 to 100.
export default function ProgressBar({ percent }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${percent}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
});
