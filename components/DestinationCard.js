import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';

export default function DestinationCard({ destination }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/destinations/${destination.id}`)}>
      {destination.image ? (
        <Image source={{ uri: destination.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No photo yet</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{destination.name}</Text>
        <Text style={styles.details}>
          {destination.category} · {destination.province}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  noImage: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: colors.textLight,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: colors.textLight,
  },
});
