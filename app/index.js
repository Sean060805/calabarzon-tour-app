import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Chip from '../components/Chip';
import PressableScale from '../components/PressableScale';
import ProgressBar from '../components/ProgressBar';
import colors from '../constants/colors';
import PROVINCES from '../constants/provinces';
import { getDestinationCount } from '../services/destinationService';
import { getProgressForStudent } from '../services/progressService';
import { toPercent } from '../utils/score';
import { getStudent } from '../utils/student';

export default function HomeScreen() {
  // { name, completed, total } once a student has typed a name on this phone; null before that
  const [summary, setSummary] = useState(null);

  const loadSummary = useCallback(async () => {
    try {
      const student = await getStudent();
      if (!student) {
        setSummary(null);
        return;
      }
      const [total, progressList] = await Promise.all([
        getDestinationCount(),
        getProgressForStudent(student.id),
      ]);
      const completed = progressList.filter((item) => item.completed).length;
      setSummary({ name: student.name, completed: Math.min(completed, total), total });
    } catch (err) {
      // No internet: the Home screen still works, it just shows the plain button instead
      console.log(err);
      setSummary(null);
    }
  }, []);

  // Runs every time the Home screen is shown, so a quiz just passed is counted
  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [loadSummary])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.region}>REGION IV-A</Text>
        <Text style={styles.title}>CALABARZON Virtual Tour</Text>
        <Text style={styles.intro}>
          Explore the historical sites, churches, museums, nature spots, and festivals of
          CALABARZON: a field trip you can take without leaving the classroom. Take the virtual
          tour of each place, then pass its quiz to complete it.
        </Text>
      </View>

      {summary ? (
        <PressableScale style={styles.progressCard} onPress={() => router.push('/progress')}>
          <Text style={styles.progressName}>{summary.name}'s progress</Text>
          <Text style={styles.progressCount}>
            {summary.completed} of {summary.total} destinations completed
          </Text>
          <ProgressBar percent={toPercent(summary.completed, summary.total)} />
          <Text style={styles.progressLink}>See all my scores ›</Text>
        </PressableScale>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Five provinces</Text>
        <Text style={styles.note}>
          The name CALABARZON is made from the letters in bold:{' '}
          <Text style={styles.bold}>Ca</Text>vite, <Text style={styles.bold}>La</Text>guna,{' '}
          <Text style={styles.bold}>Ba</Text>tangas, <Text style={styles.bold}>R</Text>izal, and{' '}
          Que<Text style={styles.bold}>zon</Text>. Tap a province to see its destinations.
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
      {/* The progress card above already opens My Progress, so the button is only needed without it */}
      {summary ? null : (
        <View style={styles.secondButton}>
          <AppButton title="My Progress" variant="outline" onPress={() => router.push('/progress')} />
        </View>
      )}
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
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    // Works like CSS box-shadow
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
  },
  progressName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  progressCount: {
    fontSize: 15,
    color: colors.textLight,
    marginTop: 2,
    marginBottom: 12,
  },
  progressLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
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
  bold: {
    fontWeight: 'bold',
    color: colors.text,
  },
  provinces: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  secondButton: {
    marginTop: 12,
  },
});
