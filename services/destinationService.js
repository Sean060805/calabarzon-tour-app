import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocsFromServer,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'destinations';

// The reads use "FromServer" so they fail with an error when there is no internet,
// instead of quietly returning an empty list.

// SELECT * FROM destinations ORDER BY name
export async function getAllDestinations() {
  const snapshot = await getDocsFromServer(query(collection(db, COLLECTION), orderBy('name')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
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
export async function deleteDestination(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}
