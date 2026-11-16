import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import StatusView from '../components/StatusView';
import colors from '../constants/colors';
import DEFAULT_SETTINGS from '../constants/defaultSettings';
import { getAllDestinations } from '../services/destinationService';
import { getAppSettings } from '../services/settingsService';

// What the app is built with. These do not change from one owner to the next.
const TOOLS = [
  'App: React Native with Expo',
  'Database: Google Firebase (Cloud Firestore)',
  '360° viewer: Pannellum (open source)',
  '360° Street View and maps: Google Maps',
  'Free-license photos: Wikimedia Commons and KartaView',
];

// Shows where the facts and photos of every destination come from
export default function CreditsScreen() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCredits = useCallback(async () => {
    try {
      const [settingsData, destinationData] = await Promise.all([
        getAppSettings(),
        getAllDestinations(),
      ]);
      setSettings(settingsData);
      setDestinations(destinationData);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load the sources. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredits();
  }, [loadCredits]);

  function handleRetry() {
    setLoading(true);
    loadCredits();
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetry} />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.appName}>{settings.appName}</Text>
        {settings.ownerName ? (
          <Text style={styles.owner}>Developed by {settings.ownerName}</Text>
        ) : null}
        <Text style={styles.body}>
          Every destination in this app is a real place. The facts were checked against the
          sources listed below, and every photo is used under a license that allows it.
        </Text>
      </View>

      <Text style={styles.heading}>Sources for each destination</Text>
      {destinations.map((destination) => (
        <Pressable
          key={destination.id}
          style={styles.card}
          onPress={() => router.push(`/destinations/${destination.id}`)}
        >
          <Text style={styles.name}>{destination.name}</Text>

          <Text style={styles.label}>Facts</Text>
          {destination.sources ? (
            // The sources are saved as one text, with one source on each line
            destination.sources.split('\n').map((source, index) => (
              <Text key={index} style={styles.body}>
                • {source}
              </Text>
            ))
          ) : (
            <Text style={styles.empty}>No sources listed yet.</Text>
          )}

          <Text style={styles.label}>Main photo</Text>
          <Text style={destination.photoCredit ? styles.body : styles.empty}>
            {destination.photoCredit || 'No photo credit listed yet.'}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.note}>
        The other photos of each tour, and the 360° photos, show their credit under the photo
        inside the tour.
      </Text>

      <Text style={styles.heading}>Built with</Text>
      <View style={styles.card}>
        {TOOLS.map((tool) => (
          <Text key={tool} style={styles.body}>
            • {tool}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  owner: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2,
    marginBottom: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 2,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  empty: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textLight,
    marginTop: 4,
  },
});
