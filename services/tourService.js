import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocsFromServer,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'tourStops';

// SELECT * FROM tourStops WHERE destinationId = ? ORDER BY `order`
// The sorting is done in JavaScript, so Firestore needs no extra index.
export async function getTourStops(destinationId) {
  const snapshot = await getDocsFromServer(
    query(collection(db, COLLECTION), where('destinationId', '==', destinationId))
  );
  const stops = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return stops.sort((a, b) => (a.order || 0) - (b.order || 0));
}

// INSERT INTO tourStops (...) VALUES (...)
// data has: kind ('photo' or '360'), image, caption, credit
export async function addTourStop(destinationId, data) {
  const newDoc = await addDoc(collection(db, COLLECTION), {
    ...data,
    destinationId,
    // The current time as a number, so a new stop always goes after the older ones
    order: Date.now(),
    createdAt: serverTimestamp(),
  });
  return newDoc.id;
}

// DELETE FROM tourStops WHERE id = ?
export async function deleteTourStop(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
