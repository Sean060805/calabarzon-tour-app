import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NameForm from '../components/NameForm';
import ProgressBar from '../components/ProgressBar';
import StatusView from '../components/StatusView';
import colors from '../constants/colors';
import { getAllDestinations } from '../services/destinationService';
import { getProgressForStudent } from '../services/progressService';
import { toPercent } from '../utils/score';
import { clearStudent, getStudent, saveStudent } from '../utils/student';

export default function ProgressScreen() {
  const [student, setStudent] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgress = useCallback(async () => {
    try {
      const savedStudent = await getStudent();
      setStudent(savedStudent);
      if (savedStudent) {
        const [destinations, progressList] = await Promise.all([
          getAllDestinations(),
          getProgressForStudent(savedStudent.id),
        ]);
        // Like a LEFT JOIN: every destination, plus its progress row if the student has one
        const joined = destinations.map((destination) => ({
          destination,
          progress: progressList.find((item) => item.destinationId === destination.id) || null,
        }));
        setRows(joined);
      }
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load your progress. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs every time this screen is shown, so a quiz just taken appears
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  function handleRetry() {
    setLoading(true);
    loadProgress();
  }

  async function handleSaveName(name) {
    await saveStudent(name);
    setLoading(true);
    loadProgress();
  }

  function handleSwitchStudent() {
    Alert.alert(
      'Switch student?',
      `The next student will type their own name and start a new progress list. ${student.name}'s scores stay saved in the database.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: confirmSwitchStudent },
      ]
    );
  }

  async function confirmSwitchStudent() {
    await clearStudent();
    setStudent(null);
    setRows([]);
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetry} />;
  }

  if (!student) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      >
        <NameForm onSubmit={handleSaveName} />
      </ScrollView>
    );
  }

  const completedCount = rows.filter((row) => row.progress && row.progress.completed).length;

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={rows}
      keyExtractor={(row) => row.destination.id}
      ListHeaderComponent={
        <View style={styles.summary}>
          <Text style={styles.name}>{student.name}'s progress</Text>
          <Text style={styles.count}>
            {completedCount} of {rows.length} destinations completed
          </Text>
          <ProgressBar percent={toPercent(completedCount, rows.length)} />
          <Pressable onPress={handleSwitchStudent} hitSlop={10}>
            <Text style={styles.switch}>Not {student.name}? Switch student</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => <ProgressRow row={item} />}
      ListEmptyComponent={<Text style={styles.empty}>No destinations yet.</Text>}
    />
  );
}

// One destination with the student's best score
function ProgressRow({ row }) {
  const { destination, progress } = row;

  let status = 'Not started';
  if (progress) {
    status = progress.completed ? '✓ Completed' : 'Not passed yet';
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={() => router.push(`/destinations/${destination.id}`)}
    >
      <View style={styles.rowInfo}>
        <Text style={styles.rowName}>{destination.name}</Text>
        <Text style={[styles.rowStatus, progress && progress.completed && styles.rowCompleted]}>
          {status}
        </Text>
      </View>
      {progress ? (
        <View style={styles.rowScore}>
          <Text style={styles.scoreNumber}>
            {progress.bestScore}/{progress.total}
          </Text>
          <Text style={styles.scoreLabel}>best score</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  summary: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  count: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 12,
  },
  switch: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginTop: 14,
  },
  empty: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.85,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  rowStatus: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 2,
  },
  rowCompleted: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  rowScore: {
    alignItems: 'center',
    marginLeft: 12,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scoreLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
});
