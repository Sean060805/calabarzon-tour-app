import { StyleSheet, Text, View } from 'react-native';

export default function AddDestinationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.note}>The add form comes in Phase 4.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  note: {
    fontSize: 16,
  },
});
