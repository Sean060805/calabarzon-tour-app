import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { hasPassed } from '../utils/score';

const COLLECTION = 'progress';

// Saves one finished quiz.
// Each student has ONE document per destination, with the ID "studentId_destinationId".
// Saving again updates that same document, like INSERT ... ON DUPLICATE KEY UPDATE.
export async function saveQuizResult({ student, destination, score, total }) {
  const progressDoc = doc(db, COLLECTION, `${student.id}_${destination.id}`);

  // Read the old result first, to keep the best score and count the attempts
  const snapshot = await getDocFromServer(progressDoc);
  const old = snapshot.exists() ? snapshot.data() : null;
  const bestScore = Math.max(old ? old.bestScore : 0, score);

  await setDoc(progressDoc, {
    studentId: student.id,
    studentName: student.name,
    destinationId: destination.id,
    destinationName: destination.name,
    lastScore: score,
    bestScore,
    total,
    attempts: (old ? old.attempts : 0) + 1,
    completed: hasPassed(bestScore, total),
    updatedAt: serverTimestamp(),
  });
}

// SELECT * FROM progress WHERE studentId = ?
export async function getProgressForStudent(studentId) {
  const snapshot = await getDocsFromServer(
    query(collection(db, COLLECTION), where('studentId', '==', studentId))
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
