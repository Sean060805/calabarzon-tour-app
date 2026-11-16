import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import { PASS_PERCENT } from '../constants/quiz';
import { hasPassed, toPercent } from '../utils/score';
import AppButton from './AppButton';

// The end of the quiz: the score, passed or not, and what to do next.
// children is an extra line under the score (used later for "Score saved").
export default function QuizResult({ score, total, onRetry, onBack, children }) {
  const passed = hasPassed(score, total);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Your score</Text>
      <Text style={[styles.score, passed ? styles.passed : styles.failed]}>
        {score} out of {total}
      </Text>
      <Text style={styles.percent}>{toPercent(score, total)}%</Text>

      <Text style={styles.message}>
        {passed
          ? 'You passed! This destination is now completed.'
          : `You need ${PASS_PERCENT}% to complete this destination. Take the tour again, then try once more.`}
      </Text>

      {children}

      <View style={styles.button}>
        <AppButton title="Try Again" variant="outline" onPress={onRetry} />
      </View>
      <View style={styles.button}>
        <AppButton title="Done" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  passed: {
    color: colors.primary,
  },
  failed: {
    color: colors.danger,
  },
  percent: {
    fontSize: 20,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
});
