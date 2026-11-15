import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CALABARZON Virtual Tour</Text>
      <Text style={styles.intro}>
        CALABARZON (Region IV-A) is made up of five provinces: Cavite, Laguna,
        Batangas, Rizal, and Quezon. Explore its historical sites, churches,
        museums, nature spots, and festivals without leaving the classroom.
      </Text>
      <Button title="Browse Destinations" onPress={() => router.push('/destinations')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
});
