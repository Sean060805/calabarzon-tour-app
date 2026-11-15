import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';

export default function DestinationCard({ destination }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/destinations/${destination.id}`)}
    >
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
    marginBottom: 16,
    // Works like CSS box-shadow
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
  },
  pressed: {
    opacity: 0.85,
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
