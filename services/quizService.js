import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'questions';

// SELECT * FROM questions WHERE destinationId = ? ORDER BY `order`
export async function getQuestions(destinationId) {
  const snapshot = await getDocsFromServer(
    query(collection(db, COLLECTION), where('destinationId', '==', destinationId))
  );
  const questions = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return questions.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// INSERT INTO questions (...) VALUES (...)
// data has: question, choices (4 strings), answerIndex (0 to 3), explanation
export async function addQuestion(destinationId, data) {
  const newDoc = await addDoc(collection(db, COLLECTION), {
    ...data,
    destinationId,
    // The current time as a number, so a new question always goes after the older ones
    order: Date.now(),
    createdAt: serverTimestamp(),
  });
  return newDoc.id;
}

// UPDATE questions SET ... WHERE id = ?
export async function updateQuestion(id, data) {
  await updateDoc(doc(db, COLLECTION, id), data);
}

// DELETE FROM questions WHERE id = ?
export async function deleteQuestion(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
