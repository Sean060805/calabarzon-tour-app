import { router, useLocalSearchParams } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Destination #{id}</Text>
      <Text style={styles.note}>The details will show here in Phase 2.</Text>
      <Button title="Edit" onPress={() => router.push(`/destinations/edit/${id}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  note: {
    fontSize: 16,
    marginBottom: 16,
  },
});
