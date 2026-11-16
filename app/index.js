import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import Chip from '../components/Chip';
import PressableScale from '../components/PressableScale';
import ProgressBar from '../components/ProgressBar';
import colors from '../constants/colors';
import DEFAULT_SETTINGS from '../constants/defaultSettings';
import PROVINCES from '../constants/provinces';
import { getDestinationCount } from '../services/destinationService';
import { getProgressForStudent } from '../services/progressService';
import { getAppSettings, getSavedAppSettings } from '../services/settingsService';
import { toPercent } from '../utils/score';
import { getStudent } from '../utils/student';

export default function HomeScreen() {
  // The app's name, logo, and opening text. They can be changed in App Settings.
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  // { name, completed, total } once a student has typed a name on this phone; null before that
  const [summary, setSummary] = useState(null);

  const loadSettings = useCallback(async () => {
    try {
      // First the copy saved on the phone (instant), then the newest one from Firebase
      setSettings(await getSavedAppSettings());
      setSettings(await getAppSettings());
    } catch (err) {
      // No internet: keep showing the saved copy or the defaults
      console.log(err);
    }
  }, []);

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

  // Runs every time the Home screen is shown, so a new name or a quiz just passed appears
  useFocusEffect(
    useCallback(() => {
      loadSettings();
      loadSummary();
    }, [loadSettings, loadSummary])
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Puts the app's name in the header at the top of this screen */}
      <Stack.Screen options={{ title: settings.appName }} />

      <View style={styles.hero}>
        {settings.logo ? <Image source={{ uri: settings.logo }} style={styles.logo} /> : null}
        {settings.label ? <Text style={styles.region}>{settings.label}</Text> : null}
        <Text style={styles.title}>{settings.appName}</Text>
        <Text style={styles.intro}>{settings.intro}</Text>
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

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <AppButton
            title="Sources and Credits"
            variant="outline"
            small
            onPress={() => router.push('/credits')}
          />
        </View>
        <View style={styles.footerItem}>
          <AppButton
            title="App Settings"
            variant="outline"
            small
            onPress={() => router.push('/settings')}
          />
        </View>
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
    padding: 20,
    paddingBottom: 48,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
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
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerItem: {
    flex: 1,
  },
});
