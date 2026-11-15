import { Link, router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function DestinationListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.note}>The real list comes in Phase 2. For now, try these test links:</Text>

      <Link href="/destinations/1" style={styles.link}>Open destination 1</Link>
      <Link href="/destinations/2" style={styles.link}>Open destination 2</Link>

      <Button title="Add Destination" onPress={() => router.push('/destinations/add')} />
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
    marginBottom: 16,
  },
  link: {
    fontSize: 18,
    color: '#1565C0',
    marginBottom: 16,
  },
});
