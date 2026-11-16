import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDocFromServer,
  getDocsFromServer,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'destinations';
// The collections whose documents point to a destination with a destinationId field
const LINKED_COLLECTIONS = ['tourStops', 'questions', 'progress'];

// The reads use "FromServer" so they fail with an error when there is no internet,
// instead of quietly returning an empty list.

// SELECT * FROM destinations ORDER BY name
export async function getAllDestinations() {
  const snapshot = await getDocsFromServer(query(collection(db, COLLECTION), orderBy('name')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

// SELECT COUNT(*) FROM destinations
// Firestore counts on the server, so the phone does not download the destinations and their photos
export async function getDestinationCount() {
  const snapshot = await getCountFromServer(collection(db, COLLECTION));
  return snapshot.data().count;
}

// SELECT * FROM destinations WHERE id = ? (returns null if not found)
export async function getDestinationById(id) {
  const snapshot = await getDocFromServer(doc(db, COLLECTION, id));
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() };
}

// INSERT INTO destinations (...) VALUES (...)
export async function addDestination(data) {
  const newDoc = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return newDoc.id;
}

// UPDATE destinations SET ... WHERE id = ?
export async function updateDestination(id, data) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// DELETE FROM destinations WHERE id = ?
// Firestore has no ON DELETE CASCADE, so the linked documents are deleted here too.
// A batch sends all the deletes together: either all of them happen, or none.
export async function deleteDestination(id) {
  const batch = writeBatch(db);

  for (const name of LINKED_COLLECTIONS) {
    const snapshot = await getDocsFromServer(
      query(collection(db, name), where('destinationId', '==', id))
    );
    snapshot.docs.forEach((item) => batch.delete(item.ref));
  }

  batch.delete(doc(db, COLLECTION, id));
  await batch.commit();
}
