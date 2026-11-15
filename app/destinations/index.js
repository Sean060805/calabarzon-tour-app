import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import DestinationCard from '../../components/DestinationCard';
import colors from '../../constants/colors';
import { getAllDestinations } from '../../services/destinationService';

export default function DestinationListScreen() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Runs every time this screen is shown, so new or changed destinations appear
  useFocusEffect(
    useCallback(() => {
      async function loadDestinations() {
        try {
          const data = await getAllDestinations();
          setDestinations(data);
          setError(null);
        } catch (err) {
          console.log(err);
          setError('Could not load destinations. Check your internet connection.');
        } finally {
          setLoading(false);
        }
      }
      loadDestinations();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Button title="Add Destination" onPress={() => router.push('/destinations/add')} />
      </View>
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DestinationCard destination={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.message}>No destinations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});
