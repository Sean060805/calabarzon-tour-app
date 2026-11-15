import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';
import { getDestinationById } from '../../services/destinationService';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestinationById(id);
        setDestination(data);
      } catch (err) {
        console.log(err);
        setError('Could not load this destination. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !destination) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{error || 'Destination not found.'}</Text>
      </View>
    );
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

        <View style={styles.button}>
          <Button title="Edit" onPress={() => router.push(`/destinations/edit/${id}`)} />
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
  center: {
    flex: 1,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 240,
  },
  content: {
    padding: 20,
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
    marginTop: 24,
  },
});
