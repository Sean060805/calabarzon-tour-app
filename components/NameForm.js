import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../constants/colors';
import AppButton from './AppButton';

// Asks for the student's name. onSubmit(name) is called with the typed name.
export default function NameForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!name.trim()) {
      setError('Please type your name.');
      return;
    }
    onSubmit(name.trim());
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>What's your name?</Text>
      <Text style={styles.note}>
        Your quiz scores are saved under this name. A first name or nickname is enough.
      </Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Klyde"
        autoCapitalize="words"
        maxLength={30}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.button}>
        <AppButton title="Continue" onPress={handleSave} />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
    marginBottom: 16,
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
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 6,
  },
  button: {
    marginTop: 16,
  },
});
