import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import QuizQuestion from '../../../components/QuizQuestion';
import QuizResult from '../../../components/QuizResult';
import StatusView from '../../../components/StatusView';
import colors from '../../../constants/colors';
import { getQuestions } from '../../../services/quizService';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Where the student is in the quiz
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadQuiz = useCallback(async () => {
    try {
      const data = await getQuestions(id);
      setQuestions(data);
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

  function handleSelect(index) {
    setSelectedIndex(index);
    // The score is worked out here: one point for each correct answer
    if (index === questions[questionIndex].answerIndex) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    if (questionIndex === questions.length - 1) {
      setFinished(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelectedIndex(null);
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

  if (questions.length === 0) {
    return <StatusView message="No quiz yet for this destination." />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {finished ? (
        <QuizResult
          score={score}
          total={questions.length}
          onRetry={handleTryAgain}
          onBack={() => router.back()}
        />
      ) : (
        <QuizQuestion
          question={questions[questionIndex]}
          number={questionIndex + 1}
          total={questions.length}
          selectedIndex={selectedIndex}
          onSelect={handleSelect}
          onNext={handleNext}
        />
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
});
