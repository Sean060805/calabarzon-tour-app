import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION = 'destinations';

// SELECT * FROM destinations ORDER BY name
export async function getAllDestinations() {
  const snapshot = await getDocs(query(collection(db, COLLECTION), orderBy('name')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

// SELECT * FROM destinations WHERE id = ? (returns null if not found)
export async function getDestinationById(id) {
  const snapshot = await getDoc(doc(db, COLLECTION, id));
  if (!snapshot.exists()) {
    return null;
  }
  return { id: snapshot.id, ...snapshot.data() };
}
