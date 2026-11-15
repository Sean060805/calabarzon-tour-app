import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import AppButton from './AppButton';

// Fills the screen with a loading spinner, or with a message like "Not found".
// If onRetry is given, a "Try Again" button appears under the message.
export default function StatusView({ loading, message, onRetry }) {
  return (
    <View style={styles.center}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Text style={styles.message}>{message}</Text>
          {onRetry ? <AppButton title="Try Again" variant="outline" onPress={onRetry} /> : null}
        </>
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
    marginBottom: 16,
  },
});
