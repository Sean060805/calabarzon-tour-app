import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import PressableScale from './PressableScale';

// completed is true when the student has passed this destination's quiz
export default function DestinationCard({ destination, completed }) {
  return (
    <PressableScale
      style={styles.card}
      onPress={() => router.push(`/destinations/${destination.id}`)}
    >
      {destination.image ? (
        <Image source={{ uri: destination.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No photo yet</Text>
        </View>
      )}
      {completed ? (
        <View style={styles.tag}>
          <Text style={styles.tagText}>✓ Completed</Text>
        </View>
      ) : null}
      <View style={styles.info}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.details}>
          {destination.category} · {destination.province}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    // Works like CSS box-shadow
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
  },
  image: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noImage: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: colors.textLight,
  },
  tag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  info: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: colors.primary,
  },
});
