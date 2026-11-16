import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../components/AppButton';
import StatusView from '../../components/StatusView';
import colors from '../../constants/colors';
import { deleteDestination, getDestinationById } from '../../services/destinationService';
import { openInGoogleMaps, openStreetView } from '../../utils/maps';

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
      `Are you sure you want to delete "${destination.name}"? Its tour photos, quiz questions, and saved scores will be deleted too. This cannot be undone.`,
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

        <View style={styles.mainButton}>
          <AppButton
            title="Start Virtual Tour"
            onPress={() => router.push(`/destinations/tour/${id}`)}
          />
        </View>
        {/* Two buttons side by side. Each one sits in a box with flex: 1, so they share the width equally. */}
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <AppButton
              title="Take the Quiz"
              variant="outline"
              onPress={() => router.push(`/destinations/quiz/${id}`)}
            />
          </View>
          {/* Only destinations with map coordinates have this button */}
          {destination.coordinates ? (
            <View style={styles.rowItem}>
              <AppButton
                title="360° Street View"
                variant="outline"
                onPress={() => openStreetView(destination.coordinates)}
              />
            </View>
          ) : null}
        </View>
        {destination.coordinates ? (
          <Text style={styles.note}>
            360° Street View opens Google Maps, where you can look around the real place.
          </Text>
        ) : null}

        <Text style={styles.label}>Address</Text>
        <Text style={styles.body}>{destination.address}</Text>
        <Pressable onPress={() => openInGoogleMaps(destination)} hitSlop={8}>
          <Text style={styles.link}>Open in Google Maps ›</Text>
        </Pressable>

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

        {destination.sources ? (
          <>
            <Text style={styles.label}>Sources</Text>
            {/* The sources are saved as one text, with one source on each line */}
            {destination.sources.split('\n').map((source, index) => (
              <Text key={index} style={styles.source}>
                • {source}
              </Text>
            ))}
          </>
        ) : null}
        {destination.photoCredit ? (
          <Text style={styles.source}>{destination.photoCredit}</Text>
        ) : null}

        {/* The less-used buttons are small and share two rows, so they don't crowd the screen */}
        <Text style={styles.manageTitle}>Manage this destination</Text>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <AppButton
              title="Edit"
              variant="outline"
              small
              onPress={() => router.push(`/destinations/edit/${id}`)}
            />
          </View>
          <View style={styles.rowItem}>
            <AppButton title="Delete" variant="danger" small onPress={handleDelete} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <AppButton
              title="Tour Photos"
              variant="outline"
              small
              onPress={() => router.push(`/destinations/stops/${id}`)}
            />
          </View>
          <View style={styles.rowItem}>
            <AppButton
              title="Quiz Questions"
              variant="outline"
              small
              onPress={() => router.push(`/destinations/questions/${id}`)}
            />
          </View>
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
  mainButton: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  rowItem: {
    flex: 1,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textLight,
    marginBottom: 4,
  },
  source: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textLight,
  },
  link: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  manageTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginTop: 32,
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
