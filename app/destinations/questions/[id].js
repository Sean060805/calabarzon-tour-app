import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../../../components/AppButton';
import QuestionForm from '../../../components/QuestionForm';
import StatusView from '../../../components/StatusView';
import colors from '../../../constants/colors';
import {
  addQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from '../../../services/quizService';

// Lists the quiz questions of one destination, with add, edit, and delete
export default function ManageQuestionsScreen() {
  const { id } = useLocalSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // null: show the list. 'new': show an empty form. A question: show the form filled with it.
  const [editing, setEditing] = useState(null);

  const loadQuestions = useCallback(async () => {
    try {
      const data = await getQuestions(id);
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load the questions. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function handleRetry() {
    setLoading(true);
    loadQuestions();
  }

  async function handleSave(data) {
    if (editing === 'new') {
      await addQuestion(id, data);
    } else {
      await updateQuestion(editing.id, data);
    }
    await loadQuestions();
    setEditing(null);
  }

  function handleDelete(question) {
    Alert.alert('Delete question?', `"${question.question}"`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => confirmDelete(question) },
    ]);
  }

  async function confirmDelete(question) {
    try {
      await deleteQuestion(question.id);
      await loadQuestions();
    } catch (err) {
      console.log(err);
      Alert.alert('Could not delete', 'Please check your internet connection and try again.');
    }
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetry} />;
  }

  if (editing) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.title}>{editing === 'new' ? 'New question' : 'Edit question'}</Text>
        <QuestionForm
          initialValues={editing === 'new' ? {} : editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quiz questions ({questions.length})</Text>

      {questions.length === 0 ? (
        <Text style={styles.empty}>No questions yet. Add the first one below.</Text>
      ) : null}

      {questions.map((question, index) => (
        <View key={question.id} style={styles.card}>
          <Text style={styles.question}>
            {index + 1}. {question.question}
          </Text>
          <Text style={styles.answer}>Answer: {question.choices[question.answerIndex]}</Text>
          <View style={styles.cardButtons}>
            <View style={styles.cardButton}>
              <AppButton title="Edit" variant="outline" onPress={() => setEditing(question)} />
            </View>
            <View style={styles.cardButton}>
              <AppButton title="Delete" variant="danger" onPress={() => handleDelete(question)} />
            </View>
          </View>
        </View>
      ))}

      <AppButton title="Add a Question" onPress={() => setEditing('new')} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  empty: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
    color: colors.text,
  },
  answer: {
    fontSize: 15,
    color: colors.primary,
    marginTop: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    marginTop: 12,
  },
  cardButton: {
    marginRight: 10,
  },
});
