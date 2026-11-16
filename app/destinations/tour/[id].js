import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import StatusView from '../../../components/StatusView';
import TourStopView from '../../../components/TourStopView';
import colors from '../../../constants/colors';
import { getDestinationById } from '../../../services/destinationService';
import { getTourStops } from '../../../services/tourService';
import { openStreetView } from '../../../utils/maps';

export default function VirtualTourScreen() {
  const { id } = useLocalSearchParams();
  const { height } = useWindowDimensions();
  const [destination, setDestination] = useState(null);
  const [stops, setStops] = useState([]);
  const [stopIndex, setStopIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTour = useCallback(async () => {
    try {
      // Ask for the destination and its tour stops at the same time
      const [destinationData, extraStops] = await Promise.all([
        getDestinationById(id),
        getTourStops(id),
      ]);
      setDestination(destinationData);
      if (destinationData) {
        // Stop 1 is always the destination's own main photo
        const firstStop = {
          id: 'main',
          kind: 'photo',
          image: destinationData.image,
          caption: destinationData.name,
          credit: destinationData.photoCredit,
        };
        setStops([firstStop, ...extraStops]);
      }
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load this tour. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Runs every time this screen is shown, so newly added tour photos appear
  useFocusEffect(
    useCallback(() => {
      loadTour();
    }, [loadTour])
  );

  function handleRetry() {
    setLoading(true);
    loadTour();
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

  // If a stop was deleted, stopIndex could point past the end of the list
  const index = Math.min(stopIndex, stops.length - 1);
  const stop = stops[index];
  const isFirst = index === 0;
  const isLast = index === stops.length - 1;

  return (
    <View style={styles.container}>
      {/* The viewer stays at the top; only the text below it scrolls.
          key makes React build a fresh viewer for each stop. */}
      <View style={{ height: height * 0.4 }}>
        <TourStopView key={stop.id} stop={stop} />
      </View>

      <View style={styles.controls}>
        <Pressable
          style={[styles.arrow, isFirst && styles.arrowOff]}
          disabled={isFirst}
          onPress={() => setStopIndex(index - 1)}
        >
          <Text style={styles.arrowText}>‹ Previous</Text>
        </Pressable>
        <Text style={styles.position}>
          Stop {index + 1} of {stops.length}
        </Text>
        <Pressable
          style={[styles.arrow, isLast && styles.arrowOff]}
          disabled={isLast}
          onPress={() => setStopIndex(index + 1)}
        >
          <Text style={styles.arrowText}>Next ›</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.caption}>{stop.caption}</Text>
        {stop.credit ? <Text style={styles.credit}>{stop.credit}</Text> : null}

        {/* Only destinations with map coordinates have this button */}
        {destination.coordinates ? (
          <View style={styles.streetView}>
            <AppButton
              title="Open 360° Street View"
              variant="outline"
              onPress={() => openStreetView(destination.coordinates)}
            />
            <Text style={styles.credit}>
              Opens Google Maps, where you can look around the real place in 360°.
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>History</Text>
        <Text style={styles.body}>
          {destination.history || 'No history has been written for this destination yet.'}
        </Text>

        <Text style={styles.label}>Cultural Significance</Text>
        <Text style={styles.body}>
          {destination.significance ||
            'No cultural significance has been written for this destination yet.'}
        </Text>

        <View style={styles.quizButton}>
          <AppButton title="Take the Quiz" onPress={() => router.push(`/destinations/quiz/${id}`)} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  arrow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  arrowOff: {
    opacity: 0.3,
  },
  arrowText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  credit: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 4,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  streetView: {
    marginTop: 16,
  },
  quizButton: {
    marginTop: 28,
  },
});
