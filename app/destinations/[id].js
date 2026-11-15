import { router, useLocalSearchParams } from 'expo-router';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';
import sampleDestinations from '../../data/sampleDestinations';

export default function DestinationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const destination = sampleDestinations.find((item) => item.id === id);

  if (!destination) {
    return (
      <View style={[styles.container, styles.content]}>
        <Text style={styles.body}>Destination not found.</Text>
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
