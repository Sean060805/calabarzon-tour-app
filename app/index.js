import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Chip from '../components/Chip';
import colors from '../constants/colors';
import PROVINCES from '../constants/provinces';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.region}>REGION IV-A</Text>
        <Text style={styles.title}>CALABARZON Virtual Tour</Text>
        <Text style={styles.intro}>
          Explore the historical sites, churches, museums, nature spots, and festivals of
          CALABARZON: a field trip you can take without leaving the classroom.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Five provinces</Text>
        <Text style={styles.note}>
          The region's name comes from its provinces: CAvite, LAguna, BAtangas, Rizal, and
          QueZON. Tap one to see its destinations.
        </Text>
        <View style={styles.provinces}>
          {PROVINCES.map((province) => (
            <Chip
              key={province}
              label={province}
              onPress={() => router.push({ pathname: '/destinations', params: { province } })}
            />
          ))}
        </View>
      </View>

      <AppButton title="Browse All Destinations" onPress={() => router.push('/destinations')} />
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
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  region: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: 6,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  intro: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
    marginBottom: 12,
  },
  provinces: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
