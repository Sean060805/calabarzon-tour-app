import { StyleSheet, Text, View } from 'react-native';
import colors from '../constants/colors';
import AppButton from './AppButton';
import FadeIn from './FadeIn';
import PressableScale from './PressableScale';

// Shows one question with its choices.
// selectedIndex is null until the student taps a choice; after that the answer is locked.
export default function QuizQuestion({ question, number, total, selectedIndex, onSelect, onNext }) {
  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.answerIndex;

  // Picks the extra style for one choice, once the question is answered
  function choiceStyle(index) {
    if (!answered) {
      return null;
    }
    if (index === question.answerIndex) {
      return styles.correct;
    }
    if (index === selectedIndex) {
      return styles.wrong;
    }
    return styles.faded;
  }

  return (
    <View>
      <Text style={styles.number}>
        Question {number} of {total}
      </Text>
      <Text style={styles.question}>{question.question}</Text>

      {question.choices.map((choice, index) => (
        <PressableScale
          key={index}
          style={[styles.choice, choiceStyle(index)]}
          disabled={answered}
          onPress={() => onSelect(index)}
        >
          <Text style={styles.choiceText}>{choice}</Text>
        </PressableScale>
      ))}

      {/* The feedback fades in, so the eye is drawn to it right after the tap */}
      {answered ? (
        <FadeIn style={styles.feedback}>
          <Text style={[styles.result, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </Text>
          {question.explanation ? (
            <Text style={styles.explanation}>{question.explanation}</Text>
          ) : null}
          <AppButton title={number === total ? 'See My Score' : 'Next Question'} onPress={onNext} />
        </FadeIn>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  number: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
    color: colors.text,
    marginBottom: 20,
  },
  choice: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  choiceText: {
    fontSize: 16,
    color: colors.text,
  },
  correct: {
    borderColor: colors.primary,
    backgroundColor: colors.correctBackground,
  },
  wrong: {
    borderColor: colors.danger,
    backgroundColor: colors.wrongBackground,
  },
  faded: {
    opacity: 0.5,
  },
  feedback: {
    marginTop: 8,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultCorrect: {
    color: colors.primary,
  },
  resultWrong: {
    color: colors.danger,
  },
  explanation: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 16,
  },
});
