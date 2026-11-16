import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import StatusView from '../../components/StatusView';
import colors from '../../constants/colors';
import { deleteDestination, getDestinationById } from '../../services/destinationService';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDestination = useCallback(async () => {
    try {
      const data = await getDestinationById(id);
      setDestination(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load this destination. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Runs every time this screen is shown, so changes from the Edit screen appear
  useFocusEffect(
    useCallback(() => {
      loadDestination();
    }, [loadDestination])
  );

  function handleRetry() {
    setLoading(true);
    loadDestination();
  }

  function handleDelete() {
    Alert.alert(
      'Delete destination?',
      `Are you sure you want to delete "${destination.name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: confirmDelete },
      ]
    );
  }

  async function confirmDelete() {
    try {
      await deleteDestination(id);
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert('Could not delete', 'Please check your internet connection and try again.');
    }
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetry} />;
  }

  if (!destination) {
    return <StatusView message="Destination not found. It may have been deleted." />;
  }

  return (
    <ScrollView style={styles.container}>
      {destination.image ? (
        <Image source={{ uri: destination.image }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.details}>
          {destination.category} · {destination.province}
        </Text>

        <Text style={styles.label}>Address</Text>
        <Text style={styles.body}>{destination.address}</Text>

        <Text style={styles.label}>About</Text>
        <Text style={styles.body}>{destination.description}</Text>

        {/* Older destinations may not have these two fields yet, so only show them if filled in */}
        {destination.history ? (
          <>
            <Text style={styles.label}>History</Text>
            <Text style={styles.body}>{destination.history}</Text>
          </>
        ) : null}

        {destination.significance ? (
          <>
            <Text style={styles.label}>Cultural Significance</Text>
            <Text style={styles.body}>{destination.significance}</Text>
          </>
        ) : null}

        <View style={styles.button}>
          <AppButton title="Edit" onPress={() => router.push(`/destinations/edit/${id}`)} />
        </View>
        <View style={styles.button}>
          <AppButton title="Delete" variant="danger" onPress={handleDelete} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  button: {
    marginTop: 16,
  },
});
