import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../constants/colors';
import AppButton from './AppButton';
import Chip from './Chip';

const LETTERS = ['A', 'B', 'C', 'D'];

// The form for one quiz question, used for both adding and editing.
// initialValues fills the form (Edit), and onSubmit(data) saves it.
export default function QuestionForm({ initialValues = {}, onSubmit, onCancel }) {
  const [question, setQuestion] = useState(initialValues.question || '');
  const [choices, setChoices] = useState(initialValues.choices || ['', '', '', '']);
  // -1 means no correct answer has been chosen yet
  const [answerIndex, setAnswerIndex] = useState(
    initialValues.answerIndex === undefined ? -1 : initialValues.answerIndex
  );
  const [explanation, setExplanation] = useState(initialValues.explanation || '');
  const [saving, setSaving] = useState(false);

  // Replaces one of the four choices, and keeps the other three
  function handleChangeChoice(index, text) {
    const newChoices = [...choices];
    newChoices[index] = text;
    setChoices(newChoices);
  }

  async function handleSave() {
    const allChoicesFilled = choices.every((choice) => choice.trim());
    if (!question.trim() || !allChoicesFilled || answerIndex === -1) {
      Alert.alert(
        'Missing information',
        'Please type the question and all four choices, then pick the correct answer.'
      );
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        question: question.trim(),
        choices: choices.map((choice) => choice.trim()),
        answerIndex,
        explanation: explanation.trim(),
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Could not save', 'Please check your internet connection and try again.');
      setSaving(false);
    }
  }

  return (
    <View>
      <Text style={styles.label}>Question</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={question}
        onChangeText={setQuestion}
        placeholder="e.g. When was Philippine independence declared?"
        multiline
      />

      {choices.map((choice, index) => (
        <View key={index}>
          <Text style={styles.label}>Choice {LETTERS[index]}</Text>
          <TextInput
            style={styles.input}
            value={choice}
            onChangeText={(text) => handleChangeChoice(index, text)}
          />
        </View>
      ))}

      <Text style={styles.label}>Correct answer</Text>
      <View style={styles.chips}>
        {LETTERS.map((letter, index) => (
          <Chip
            key={letter}
            label={`Choice ${letter}`}
            selected={answerIndex === index}
            onPress={() => setAnswerIndex(index)}
          />
        ))}
      </View>

      <Text style={styles.label}>Explanation (shown after answering, optional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={explanation}
        onChangeText={setExplanation}
        placeholder="One sentence that says why the answer is correct"
        multiline
      />

      <View style={styles.saveArea}>
        {saving ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <AppButton title="Save Question" onPress={handleSave} />
            <View style={styles.cancel}>
              <AppButton title="Cancel" variant="outline" onPress={onCancel} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  saveArea: {
    marginTop: 24,
  },
  cancel: {
    marginTop: 12,
  },
});
