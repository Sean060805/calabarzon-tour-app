import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage keeps small pieces of text on the phone, like a browser cookie.
// It only stores text, so the student object is turned into JSON text and back.
const KEY = 'student';

// Returns { id, name }, or null if no name has been saved on this phone yet
export async function getStudent() {
  const text = await AsyncStorage.getItem(KEY);
  return text ? JSON.parse(text) : null;
}

// Saves a new student on this phone and returns it
export async function saveStudent(name) {
  // A random ID such as "mb3k2x9f4q7", so two students with the same name don't share progress
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const student = { id, name };
  await AsyncStorage.setItem(KEY, JSON.stringify(student));
  return student;
}

// Forgets the student, so the next person can type their own name
export async function clearStudent() {
  await AsyncStorage.removeItem(KEY);
}
