import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import FadeIn from '../../../components/FadeIn';
import NameForm from '../../../components/NameForm';
import ProgressBar from '../../../components/ProgressBar';
import QuizQuestion from '../../../components/QuizQuestion';
import QuizResult from '../../../components/QuizResult';
import StatusView from '../../../components/StatusView';
import colors from '../../../constants/colors';
import { getDestinationById } from '../../../services/destinationService';
import { saveQuizResult } from '../../../services/progressService';
import { getQuestions } from '../../../services/quizService';
import { vibrateError, vibrateSuccess } from '../../../utils/haptics';
import { toPercent } from '../../../utils/score';
import { getStudent, saveStudent } from '../../../utils/student';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const [destination, setDestination] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Where the student is in the quiz
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // 'saving', 'saved', or 'failed'
  const [saveStatus, setSaveStatus] = useState('saving');

  const loadQuiz = useCallback(async () => {
    try {
      const [destinationData, questionData, studentData] = await Promise.all([
        getDestinationById(id),
        getQuestions(id),
        getStudent(),
      ]);
      setDestination(destinationData);
      setQuestions(questionData);
      setStudent(studentData);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load the quiz. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  function handleRetryLoad() {
    setLoading(true);
    loadQuiz();
  }

  async function handleSaveName(name) {
    const newStudent = await saveStudent(name);
    setStudent(newStudent);
  }

  function handleSelect(index) {
    setSelectedIndex(index);
    // The score is worked out here: one point for each correct answer
    if (index === questions[questionIndex].answerIndex) {
      setScore(score + 1);
      vibrateSuccess();
    } else {
      vibrateError();
    }
  }

  function handleNext() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
      saveScore();
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelectedIndex(null);
    }
  }

  // Saves the finished quiz to Firebase
  async function saveScore() {
    setSaveStatus('saving');
    try {
      await saveQuizResult({ student, destination, score, total: questions.length });
      setSaveStatus('saved');
    } catch (err) {
      console.log(err);
      setSaveStatus('failed');
    }
  }

  function handleTryAgain() {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setScore(0);
    setFinished(false);
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetryLoad} />;
  }

  if (!destination) {
    return <StatusView message="Destination not found. It may have been deleted." />;
  }

  if (questions.length === 0) {
    return <StatusView message="No quiz yet for this destination." />;
  }

  // Ask for a name before the first quiz, so the score can be saved under it
  if (!student) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <NameForm onSubmit={handleSaveName} />
      </ScrollView>
    );
  }

  // How many questions have been answered so far, for the bar at the top
  const answeredCount = finished ? questions.length : questionIndex + (selectedIndex === null ? 0 : 1);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{destination.name}</Text>
      <View style={styles.progress}>
        <ProgressBar percent={toPercent(answeredCount, questions.length)} />
      </View>

      {/* key makes React build a new FadeIn for each question, so every question fades in */}
      {finished ? (
        <FadeIn key="result">
          <QuizResult
            score={score}
            total={questions.length}
            onRetry={handleTryAgain}
            onBack={() => router.back()}
          >
            {saveStatus === 'saving' ? (
              <Text style={styles.saveNote}>Saving your score...</Text>
            ) : null}
            {saveStatus === 'saved' ? (
              <Text style={styles.saveNote}>Score saved for {student.name}.</Text>
            ) : null}
            {saveStatus === 'failed' ? (
              <View>
                <Text style={[styles.saveNote, styles.saveFailed]}>
                  Your score was not saved. Check your internet connection.
                </Text>
                <AppButton title="Save Again" variant="outline" onPress={saveScore} />
              </View>
            ) : null}
          </QuizResult>
        </FadeIn>
      ) : (
        <FadeIn key={questionIndex}>
          <QuizQuestion
            question={questions[questionIndex]}
            number={questionIndex + 1}
            total={questions.length}
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            onNext={handleNext}
          />
        </FadeIn>
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
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  progress: {
    marginBottom: 20,
  },
  saveNote: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginVertical: 8,
  },
  saveFailed: {
    color: colors.danger,
  },
});
