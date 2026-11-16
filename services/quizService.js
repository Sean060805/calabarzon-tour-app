import { collection, getDocsFromServer, query, where } from 'firebase/firestore';
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
