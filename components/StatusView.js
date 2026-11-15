import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';

// Fills the screen with a loading spinner, or with a message like "Not found"
export default function StatusView({ loading, message }) {
  return (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});
