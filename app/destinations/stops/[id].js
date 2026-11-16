import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import StatusView from '../../../components/StatusView';
import TourStopForm from '../../../components/TourStopForm';
import colors from '../../../constants/colors';
import { addTourStop, deleteTourStop, getTourStops } from '../../../services/tourService';

// Lists the tour photos of one destination, with a form to add more
export default function ManageTourPhotosScreen() {
  const { id } = useLocalSearchParams();
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStops = useCallback(async () => {
    try {
      const data = await getTourStops(id);
      setStops(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load the tour photos. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStops();
  }, [loadStops]);

  function handleRetry() {
    setLoading(true);
    loadStops();
  }

  async function handleAdd(data) {
    await addTourStop(id, data);
    await loadStops();
  }

  function handleDelete(stop) {
    Alert.alert('Delete photo?', `Remove "${stop.caption}" from the tour?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(stop) },
    ]);
  }

  async function confirmDelete(stop) {
    try {
      await deleteTourStop(stop.id);
      await loadStops();
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

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.title}>Photos in this tour</Text>
      <Text style={styles.note}>
        Stop 1 is always the destination's main photo. The photos below come after it.
      </Text>

      {stops.length === 0 ? <Text style={styles.empty}>No extra photos yet.</Text> : null}

      {stops.map((stop, index) => (
        <View key={stop.id} style={styles.row}>
          <Image source={{ uri: stop.image }} style={styles.thumbnail} />
          <View style={styles.rowInfo}>
            <Text style={styles.rowKind}>
              Stop {index + 2} · {stop.kind === '360' ? '360° photo' : 'Normal photo'}
            </Text>
            <Text style={styles.rowCaption}>{stop.caption}</Text>
            <View style={styles.rowButton}>
              <AppButton title="Delete" variant="danger" onPress={() => handleDelete(stop)} />
            </View>
          </View>
        </View>
      ))}

      <Text style={[styles.title, styles.addTitle]}>Add a photo</Text>
      <TourStopForm onSubmit={handleAdd} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  addTitle: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textLight,
    marginBottom: 12,
  },
  empty: {
    fontSize: 16,
    color: colors.textLight,
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    width: 110,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowKind: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  rowCaption: {
    fontSize: 15,
    color: colors.text,
  },
  rowButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});
